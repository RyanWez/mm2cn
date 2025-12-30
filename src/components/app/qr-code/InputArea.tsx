"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { QRType, WifiData } from "./types";

interface InputAreaProps {
  type: QRType;
  content: string;
  wifiData: WifiData;
  onContentChange: (content: string) => void;
  onWifiDataChange: (data: WifiData) => void;
}

export function InputArea({
  type,
  content,
  wifiData,
  onContentChange,
  onWifiDataChange,
}: InputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current && type === "text") {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, type]);

  if (type === "url") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-2"
      >
        <div className="relative group">
          <Input
            id="url-input"
            type="url"
            maxLength={2000}
            placeholder="https://example.com"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-12 bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pl-4 text-sm"
          />
        </div>
      </motion.div>
    );
  }

  if (type === "text") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="relative">
          <Textarea
            ref={textareaRef}
            id="text-input"
            maxLength={2500}
            placeholder="Type your text here..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full min-h-[120px] bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all p-4 text-sm resize-none"
          />
          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-white/80 dark:bg-zinc-800/80 px-2 py-1 rounded-md backdrop-blur-sm">
            {content.length}/2500 chars
          </div>
        </div>
      </motion.div>
    );
  }

  if (type === "wifi") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="wifi-ssid" className="text-xs text-muted-foreground ml-1">Network Name</Label>
          <Input
            id="wifi-ssid"
            maxLength={32}
            placeholder="My WiFi Network"
            value={wifiData.ssid}
            onChange={(e) =>
              onWifiDataChange({ ...wifiData, ssid: e.target.value })
            }
            className="h-10 bg-white/50 dark:bg-zinc-900/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wifi-password" className="text-xs text-muted-foreground ml-1">Password</Label>
            <Input
              id="wifi-password"
              type="password"
              maxLength={63}
              placeholder="Enter password"
              value={wifiData.password}
              onChange={(e) =>
                onWifiDataChange({ ...wifiData, password: e.target.value })
              }
              className="h-10 bg-white/50 dark:bg-zinc-900/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wifi-encryption" className="text-xs text-muted-foreground ml-1">Security</Label>
            <Select
              value={wifiData.encryption}
              onValueChange={(value: "WPA" | "WEP" | "nopass") =>
                onWifiDataChange({ ...wifiData, encryption: value })
              }
            >
              <SelectTrigger id="wifi-encryption" className="h-10 bg-white/50 dark:bg-zinc-900/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Checkbox
            id="wifi-hidden"
            checked={wifiData.hidden}
            onCheckedChange={(checked) =>
              onWifiDataChange({ ...wifiData, hidden: checked as boolean })
            }
            className="h-4 w-4"
          />
          <Label
            htmlFor="wifi-hidden"
            className="text-sm font-normal cursor-pointer select-none text-muted-foreground"
          >
            Hidden network
          </Label>
        </div>
      </motion.div>
    );
  }

  return null;
}
