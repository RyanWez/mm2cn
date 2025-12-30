"use client";

import { useState, useTransition, useEffect } from "react";
import { Translator } from "@/components/app/translator";
import { Sidebar } from "@/components/app/sidebar";
import { Header } from "@/components/app/header";
import { TranslationHistory } from "@/components/app/translator/TranslationHistory";
import { PageTransition } from "@/components/app/PageTransition";
import { useTranslator } from "@/hooks/use-translator";
import { useRouter } from "next/navigation";
import { getSidebarCollapsed, setSidebarCollapsed } from "@/lib/storage";

export default function TranslatePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const translatorState = useTranslator();
  const { uid, historyRefreshTrigger, handleSelectFromHistory } = translatorState;

  // Restore sidebar state from localStorage on mount
  useEffect(() => {
    const savedCollapsed = getSidebarCollapsed();
    setIsSidebarCollapsed(savedCollapsed);
  }, []);

  const handleTranslateClick = () => {
    // Already on translate page, do nothing
  };

  const handleQRCodeClick = () => {
    startTransition(() => {
      router.push("/qrcode");
    });
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    setSidebarCollapsed(collapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar
        onTranslateClick={handleTranslateClick}
        onQRCodeClick={handleQRCodeClick}
        currentMode="translate"
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
        <Header
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
          onMobileMenuToggle={handleMobileMenuToggle}
          mode="translate"
          rightContent={
            <TranslationHistory
              uid={uid}
              onSelectTranslation={handleSelectFromHistory}
              refreshTrigger={historyRefreshTrigger}
            />
          }
        />

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <PageTransition mode="translate">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4 sm:mb-6 text-center">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                  AI-powered translation for customer service chats.
                </p>
              </div>
              <Translator
                inputText={translatorState.inputText}
                setInputText={translatorState.setInputText}
                translation={translatorState.translation}
                isLoading={translatorState.isLoading}
                isStreaming={translatorState.isStreaming}
                error={translatorState.error}
                cooldown={translatorState.cooldown}
                handleTranslate={translatorState.handleTranslate}
                isTranslateDisabled={translatorState.isTranslateDisabled}
                finalTranslationRef={translatorState.finalTranslationRef}
                uid={translatorState.uid}
                historyRefreshTrigger={translatorState.historyRefreshTrigger}
                handleSelectFromHistory={translatorState.handleSelectFromHistory}
              />
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
