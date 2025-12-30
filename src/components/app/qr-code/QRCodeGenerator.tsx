"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TypeSelector } from "./TypeSelector";
import { InputArea } from "./InputArea";
import { QRPreview } from "./QRPreview";
import { LogoSelector } from "./LogoSelector";
import { ActionButtons } from "./ActionButtons";
import { DEFAULT_QR_STATE, QRCodeState, QRType, LogoSettings, WifiData } from "./types";

export function QRCodeGenerator() {
  const [state, setState] = useState<QRCodeState>(DEFAULT_QR_STATE);

  // Generate QR value based on type
  const qrValue = useMemo(() => {
    if (state.type === "url" || state.type === "text") {
      return state.content;
    }

    if (state.type === "wifi") {
      const { ssid, password, encryption, hidden } = state.wifiData;
      if (!ssid) return "";

      // WiFi QR format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
      return `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? "true" : "false"};;`;
    }

    return "";
  }, [state.type, state.content, state.wifiData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Input Controls */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-xl shadow-indigo-500/5 dark:shadow-none p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-6">
              {/* Type Selector */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Content Type
                </h3>
                <TypeSelector
                  selectedType={state.type}
                  onTypeChange={(type: QRType) =>
                    setState({ ...state, type, content: "" })
                  }
                />
              </div>

              {/* Input Area */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  Details
                </h3>
                <InputArea
                  type={state.type}
                  content={state.content}
                  wifiData={state.wifiData}
                  onContentChange={(content: string) =>
                    setState({ ...state, content })
                  }
                  onWifiDataChange={(wifiData: WifiData) =>
                    setState({ ...state, wifiData })
                  }
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-xl shadow-indigo-500/5 dark:shadow-none p-6"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Customization
              </h3>
              {/* Logo Settings */}
              <LogoSelector
                logoSettings={state.logoSettings}
                onLogoSettingsChange={(logoSettings: LogoSettings) =>
                  setState({ ...state, logoSettings })
                }
              />
            </div>
          </motion.div>
        </div>

        {/* Right Column - QR Preview & Actions */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <QRPreview state={state} qrValue={qrValue} />
          <ActionButtons qrValue={qrValue} />
        </div>
      </div>
    </motion.div>
  );
}
