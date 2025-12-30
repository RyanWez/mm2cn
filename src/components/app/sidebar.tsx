"use client";

import { useState, memo } from "react";
import { Languages, Gift, QrCode, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  onTranslateClick: () => void;
  onQRCodeClick?: () => void;
  currentMode?: "translate" | "qrcode";
  isCollapsed: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = memo(function Sidebar({
  onTranslateClick,
  onQRCodeClick,
  currentMode = "translate",
  isCollapsed,
  isMobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const [isToolsExpanded, setIsToolsExpanded] = useState(currentMode === "qrcode");

  const handleTranslateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onTranslateClick();
    onMobileClose?.();
  };

  const handleQRCodeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onQRCodeClick?.();
    onMobileClose?.();
  };

  const toggleTools = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsToolsExpanded(!isToolsExpanded);
  };

  // Sidebar content component (reusable for both desktop and mobile)
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-background/95 backdrop-blur-sm">
      {/* Header with Logo */}
      <div className="flex h-16 items-center overflow-hidden border-b border-border px-4">
        {!isCollapsed ? (
          <div className="flex w-full items-center gap-3">
            <Image
              src="/icons/Logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="icon-hover h-8 w-8 flex-shrink-0"
            />
            <span className="translate-x-0 transform whitespace-nowrap font-semibold text-foreground opacity-100 transition-all duration-500 ease-out">
              Myanmar-Chinese
            </span>
          </div>
        ) : (
          <div className="flex w-full justify-center transition-all duration-300">
            <Image
              src="/icons/Logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="icon-hover h-8 w-8"
            />
          </div>
        )}
      </div>

      {/* Translate Mode */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "smooth-transition w-full font-semibold hover:bg-accent hover:bg-accent/50",
            currentMode === "translate" ? "bg-primary text-primary-foreground" : "bg-accent/80",
            isCollapsed ? "justify-center px-2" : "justify-start gap-3"
          )}
          onClick={handleTranslateClick}
        >
          <Languages className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="translate-x-0 transform whitespace-nowrap opacity-100 transition-all duration-500 ease-out">
              Translate Mode
            </span>
          )}
        </Button>

        {/* Tools Section (礼物) */}
        <div className="space-y-1">
          {isCollapsed ? (
            // Collapsed state: Show popover
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center w-full px-4 py-2 rounded-md transition-all duration-200",
                    "hover:bg-accent/50 text-foreground justify-center"
                  )}
                >
                  <Gift className="h-5 w-5 flex-shrink-0" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="right"
                align="center"
                sideOffset={16}
                className="w-48 p-2 animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-200"
              >
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-sm font-medium text-foreground">
                    礼物
                  </div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 hover:bg-accent/50 text-sm transition-all duration-200",
                      currentMode === "qrcode" && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={handleQRCodeClick}
                  >
                    <QrCode className="h-4 w-4 flex-shrink-0" />
                    <span>QR Code</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            // Expanded state: Show collapsible menu
            <>
              <button
                type="button"
                className={cn(
                  "flex items-center w-full px-4 py-2 rounded-md transition-colors duration-200",
                  "hover:bg-accent/50 text-foreground justify-between"
                )}
                onClick={toggleTools}
              >
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">礼物</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                    isToolsExpanded ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              {/* Collapsible Tools Menu */}
              <div
                className={cn(
                  "ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                  isToolsExpanded
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 hover:bg-accent/50 text-sm transition-colors duration-200",
                    currentMode === "qrcode" && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={handleQRCodeClick}
                >
                  <QrCode className="h-4 w-4 flex-shrink-0" />
                  <span>QR Code</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div
        className={cn(
          "smooth-transition fixed left-0 top-0 z-40 hidden h-screen border-r border-border bg-background/95 shadow-lg backdrop-blur-sm lg:block",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Sheet Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-64 bg-background p-0 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
});
