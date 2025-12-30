"use client";

import { useState, useTransition, useEffect } from "react";
import { QRCodeGenerator } from "@/components/app/qr-code/QRCodeGenerator";
import { Sidebar } from "@/components/app/sidebar";
import { Header } from "@/components/app/header";
import { PageTransition } from "@/components/app/PageTransition";
import { useRouter } from "next/navigation";
import { getSidebarCollapsed, setSidebarCollapsed } from "@/lib/storage";

export default function QRCodePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Restore sidebar state from localStorage on mount
  useEffect(() => {
    const savedCollapsed = getSidebarCollapsed();
    setIsSidebarCollapsed(savedCollapsed);
  }, []);

  const handleTranslateClick = () => {
    startTransition(() => {
      router.push("/translate");
    });
  };

  const handleQRCodeClick = () => {
    // Already on qrcode page, do nothing
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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        onTranslateClick={handleTranslateClick}
        onQRCodeClick={handleQRCodeClick}
        currentMode="qrcode"
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      <div className={`relative flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}>
        {/* Ambient Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 -z-10" />
        <div className="absolute top-0 right-0 p-32 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 p-32 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <Header
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
          onMobileMenuToggle={handleMobileMenuToggle}
          mode="qrcode"
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <PageTransition mode="qrcode">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  QR Code Generator
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
                  Create beautiful, customized QR codes for your links, text, or Wi-Fi networks in seconds.
                </p>
              </div>
              <QRCodeGenerator />
            </div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
