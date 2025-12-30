import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode } from "lucide-react";
import { QRCodeState } from "./types";

interface QRPreviewProps {
  state: QRCodeState;
  qrValue: string;
}

export function QRPreview({ state, qrValue }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!qrValue || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate QR code
    QRCode.toCanvas(
      canvas,
      qrValue,
      {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      },
      (error) => {
        if (error) {
          console.error("QR Code generation error:", error);
          return;
        }

        // Add logo if selected
        if (state.logoSettings.logo !== "none") {
          addLogo(ctx, canvas, state.logoSettings);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrValue, state.logoSettings]);

  const addLogo = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    logoSettings: any
  ) => {
    const logoPath = getLogoPath(logoSettings.logo);
    if (!logoPath) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const logoSize = logoSettings.size;
      const padding = 8;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;

      // Draw background based on shape
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();

      if (logoSettings.shape === "circle") {
        ctx.arc(
          x + logoSize / 2,
          y + logoSize / 2,
          (logoSize + padding * 2) / 2,
          0,
          Math.PI * 2
        );
      } else if (logoSettings.shape === "square") {
        ctx.rect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2);
      } else {
        // rounded
        ctx.roundRect(x - padding, y - padding, logoSize + padding * 2, logoSize + padding * 2, 12);
      }
      ctx.fill();

      // Add border if enabled
      if (logoSettings.borderEnabled) {
        ctx.strokeStyle = logoSettings.borderColor;
        ctx.lineWidth = logoSettings.borderWidth;
        ctx.stroke();
      }

      // Add subtle shadow for depth
      ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 3;

      // Clip to shape for logo
      ctx.save();
      ctx.beginPath();
      if (logoSettings.shape === "circle") {
        ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      } else if (logoSettings.shape === "square") {
        ctx.rect(x, y, logoSize, logoSize);
      } else {
        ctx.roundRect(x, y, logoSize, logoSize, 8);
      }
      ctx.clip();

      // Draw logo with high quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, x, y, logoSize, logoSize);

      ctx.restore();

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    };
    img.src = logoPath;
  };

  const getLogoPath = (logo: string) => {
    switch (logo) {
      case "dino":
        return "/logo/Dino.svg";
      case "wavepay":
        return "/logo/Wave-Pay.png";
      case "kbzpay":
        return "/logo/KBZ-Pay.webp";
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Card styling */}
      <div className="relative w-full aspect-square max-w-[340px] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800">

        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />

        <AnimatePresence mode="wait">
          {!qrValue ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center p-6 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mx-auto text-indigo-500">
                <QrCode className="w-8 h-8 opacity-50" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Ready to Generate
                </p>
                <p className="text-xs text-muted-foreground max-w-[180px] mx-auto">
                  Enter your content to see the QR code appear here instantly.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              className="p-6 bg-white rounded-xl"
            >
              <canvas
                ref={canvasRef}
                id="qr-code-canvas"
                className="max-w-full h-auto shadow-sm"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {qrValue && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-xs font-medium text-muted-foreground uppercase tracking-widest"
        >
          Scan Me
        </motion.p>
      )}
    </div>
  );
}
