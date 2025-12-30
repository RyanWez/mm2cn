"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Copy, History, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getTranslationHistory, deleteTranslationHistory } from "@/lib/storage";

interface TranslationHistoryItem {
  id: string;
  originalText: string;
  translatedText: string;
  createdAt: Date;
}

interface TranslationHistoryProps {
  uid: string | null;
  onSelectTranslation?: (original: string, translated: string) => void;
  refreshTrigger?: number;
}

export function TranslationHistory({
  uid,
  onSelectTranslation,
  refreshTrigger = 0
}: TranslationHistoryProps) {
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const itemsPerPage = 5; // Reduced for dialog view

  const fetchHistory = useCallback(async (page: number = 1) => {
    if (!uid) return;

    setIsLoading(true);
    setError("");

    try {
      const allHistory = getTranslationHistory();

      const historyWithIds = allHistory.map((item, index) => ({
        ...item,
        id: `history-${index}-${item.createdAt.getTime()}`,
      }));

      setTotalCount(historyWithIds.length);

      const startIndex = (page - 1) * itemsPerPage;
      const paginatedHistory = historyWithIds.slice(startIndex, startIndex + itemsPerPage);
      setHistory(paginatedHistory);
    } catch (err) {
      setError("Failed to load translation history");
      console.error("Error fetching history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [uid, itemsPerPage]);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [uid, refreshTrigger, fetchHistory, currentPage]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDelete = (id: string) => {
    // Delete from localStorage
    deleteTranslationHistory(id);
    // Refresh history
    fetchHistory(currentPage);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!uid) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-10 w-10 rounded-md hover:bg-accent border border-border/40 transition-all duration-300 shadow-sm bg-background/50 hover:shadow-md"
          title="Translation History"
        >
          <History className="h-5 w-5" />
          {totalCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {totalCount > 99 ? "99+" : totalCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Translation History
            {totalCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {totalCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            View and reuse your previous translations
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading history...
              </div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-destructive">
              {error}
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No translation history yet. Start translating to see your history here!
            </div>
          ) : (
            <>
              <ScrollArea className="h-[60vh] pr-4">
                <motion.div
                  key={`page-${currentPage}`}
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Accordion type="single" collapsible className="space-y-3">
                    {history.map((item, index) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="border rounded-lg bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/20 [&[data-state=open]]:bg-accent/30">
                          <div className="flex items-center justify-between w-full pr-2 gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Badge variant="outline" className="shrink-0 font-semibold">
                                #{history.length - index}
                              </Badge>
                              <p className="text-sm font-medium truncate text-left flex-1">
                                {item.originalText.substring(0, 60)}
                                {item.originalText.length > 60 && "..."}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span className="hidden sm:inline">
                                {formatTimeAgo(item.createdAt)}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-0">
                          <div className="space-y-3 pt-3">
                            {/* Original Text */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">
                                  Original
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item.originalText, `${item.id}-original`)}
                                  className="h-7 px-2 text-xs"
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  {copiedStates[`${item.id}-original`] ? "Copied!" : "Copy"}
                                </Button>
                              </div>
                              <div className="bg-muted/50 rounded-md p-3 border-l-2 border-primary/20">
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {item.originalText}
                                </p>
                              </div>
                            </div>

                            {/* Translation */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">
                                  Translation
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(item.translatedText, `${item.id}-translation`)}
                                  className="h-7 px-2 text-xs"
                                >
                                  <Copy className="h-3 w-3 mr-1" />
                                  {copiedStates[`${item.id}-translation`] ? "Copied!" : "Copy"}
                                </Button>
                              </div>
                              <div className="bg-accent/50 rounded-md p-3 border-l-2 border-secondary/40">
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {item.translatedText}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                                className="h-8 px-3 text-xs"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              </ScrollArea>

              {totalCount > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <p>
                      Page {currentPage} of {totalPages} ({totalCount} total)
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchHistory(currentPage)}
                      className="text-xs h-7"
                    >
                      Refresh
                    </Button>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 px-3 text-xs"
                      >
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "ghost"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="h-8 w-8 p-0 text-xs"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 px-3 text-xs"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
