"use client";

import { Languages, QrCode, Menu, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { ReactNode, memo } from "react";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
  onMobileMenuToggle?: () => void;
  mode?: "translate" | "qrcode";
  rightContent?: ReactNode;
}

export const Header = memo(function Header({ isCollapsed, onToggle, onMobileMenuToggle, mode = "translate", rightContent }: HeaderProps) {
  const isQRMode = mode === "qrcode";
  const Icon = isQRMode ? QrCode : Languages;
  const title = isQRMode ? "QR Code Generator" : "Myanmar-Chinese Chat Assistant";
  const shortTitle = isQRMode ? "QR Code" : "MM-CN";

  return (
    <header className="h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50 smooth-transition">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu - Only visible on mobile */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-accent border border-border/40 transition-all duration-300 shadow-sm bg-background/50 hover:shadow-md"
          aria-label="Open Menu"
          title="Open Menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>

        {/* Desktop Toggle - Only visible on desktop */}
        <button
          onClick={() => onToggle(!isCollapsed)}
          className="hidden lg:block p-2 rounded-md hover:bg-accent border border-border/40 transition-all duration-300 shadow-sm bg-background/50 hover:shadow-md"
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 text-foreground transition-all duration-300" />
          ) : (
            <PanelLeftClose className="h-5 w-5 text-foreground transition-all duration-300" />
          )}
        </button>

        {/* Logo and Title */}
        <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary icon-hover flex-shrink-0" />
          {/* Full title on desktop, short on mobile */}
          <h1 className="font-headline text-sm sm:text-base lg:text-lg font-bold tracking-tight text-primary">
            <span className="hidden sm:inline">{title}</span>
            <span className="sm:hidden">{shortTitle}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {rightContent}
      </div>
    </header>
  );
});
