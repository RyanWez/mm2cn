"use client";

import { useState } from "react";
import { X, Upload, Image as ImageIcon, Circle, Square, Hexagon, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LogoSettings, QRLogo, LogoShape } from "./types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

interface LogoSelectorProps {
  logoSettings: LogoSettings;
  onLogoSettingsChange: (settings: LogoSettings) => void;
}

export function LogoSelector({ logoSettings, onLogoSettingsChange }: LogoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const logos: { id: QRLogo; label: string; path?: string }[] = [
    { id: "none", label: "None" },
    { id: "dino", label: "Dino", path: "/logo/Dino.svg" },
    { id: "wavepay", label: "Wave Pay", path: "/logo/Wave-Pay.png" },
    { id: "kbzpay", label: "KBZ Pay", path: "/logo/KBZ-Pay.webp" },
  ];

  const shapes: { id: LogoShape; label: string; icon: any }[] = [
    { id: "circle", label: "Circle", icon: Circle },
    { id: "square", label: "Square", icon: Square },
    { id: "rounded", label: "Rounded", icon: Hexagon },
  ];

  const handleLogoChange = (logo: QRLogo) => {
    onLogoSettingsChange({ ...logoSettings, logo });
  };

  const handleSizeChange = (size: number) => {
    onLogoSettingsChange({ ...logoSettings, size });
  };

  const handleShapeChange = (shape: LogoShape) => {
    onLogoSettingsChange({ ...logoSettings, shape });
  };

  const handleBorderToggle = () => {
    onLogoSettingsChange({ ...logoSettings, borderEnabled: !logoSettings.borderEnabled });
  };

  const handleBorderColorChange = (borderColor: string) => {
    onLogoSettingsChange({ ...logoSettings, borderColor });
  };

  const handleBorderWidthChange = (borderWidth: number) => {
    onLogoSettingsChange({ ...logoSettings, borderWidth });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-xs sm:text-sm h-9 sm:h-10">
          <span className="flex items-center gap-1.5 sm:gap-2">
            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            LOGO SETTINGS
          </span>
          <ChevronDown
            className={cn(
              "h-3 w-3 sm:h-4 sm:w-4 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
          {/* Logo Selection */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Select Logo</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {logos.map((logo) => {
                const isActive = logoSettings.logo === logo.id;

                return (
                  <Button
                    key={logo.id}
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "h-20 sm:h-20 flex flex-col items-center justify-center gap-1 p-2",
                      isActive && "ring-2 ring-primary"
                    )}
                    onClick={() => handleLogoChange(logo.id)}
                  >
                    {logo.id === "none" ? (
                      <X className="h-5 w-5 sm:h-6 sm:w-6" />
                    ) : logo.path ? (
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                        <Image
                          src={logo.path}
                          alt={logo.label}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : null}
                    <span className="text-[9px] sm:text-[10px] text-center">{logo.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Logo Customization - Only show if logo is selected */}
          {logoSettings.logo !== "none" && (
            <>
              <Separator />

              {/* Logo Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Logo Size</Label>
                  <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">{logoSettings.size}px</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  step="5"
                  value={logoSettings.size}
                  onChange={(e) => handleSizeChange(Number(e.target.value))}
                  className="w-full h-1.5 sm:h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Logo Shape */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Logo Shape</Label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {shapes.map((shape) => {
                    const Icon = shape.icon;
                    const isActive = logoSettings.shape === shape.id;

                    return (
                      <Button
                        key={shape.id}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "flex items-center gap-1 sm:gap-2 text-xs px-2 sm:px-3",
                          isActive && "ring-2 ring-primary"
                        )}
                        onClick={() => handleShapeChange(shape.id)}
                      >
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-[10px] sm:text-xs">{shape.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Logo Border */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Logo Border</Label>
                  <button
                    onClick={handleBorderToggle}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                      logoSettings.borderEnabled ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        logoSettings.borderEnabled ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                {logoSettings.borderEnabled && (
                  <div className="space-y-2 sm:space-y-3 pl-2 border-l-2 border-muted">
                    {/* Border Color */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Border Color</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={logoSettings.borderColor}
                          onChange={(e) => handleBorderColorChange(e.target.value)}
                          className="h-8 w-12 sm:w-16 rounded border cursor-pointer"
                        />
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                          {logoSettings.borderColor}
                        </span>
                      </div>
                    </div>

                    {/* Border Width */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Border Width</Label>
                        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                          {logoSettings.borderWidth}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={logoSettings.borderWidth}
                        onChange={(e) => handleBorderWidthChange(Number(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Upload Custom Logo - Future Feature */}
          <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10" disabled>
            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            Upload your own (Coming soon)
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
