"use client";

import { useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  qrValue: string;
}

export function ActionButtons({ qrValue }: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleDownload = () => {
    if (!qrValue) {
      toast({
        title: "Error",
        description: "Please enter content to generate QR code first.",
        variant: "destructive",
      });
      return;
    }

    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qrcode-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: "Downloaded!",
          description: "QR code has been downloaded successfully.",
        });
      }
    });
  };

  const handleCopy = async () => {
    if (!qrValue) {
      toast({
        title: "Error",
        description: "Please enter content to generate QR code first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);

          toast({
            title: "Copied!",
            description: "QR code has been copied to clipboard.",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR code to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleDownload}
        disabled={!qrValue}
        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl h-12 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none transition-all"
      >
        <Download className="mr-2 h-4 w-4" />
        Download PNG
      </Button>

      <Button
        onClick={handleCopy}
        variant="outline"
        disabled={!qrValue}
        className="flex-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-xl h-12 font-medium transition-all"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Copied
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy Image
          </>
        )}
      </Button>
    </div>
  );
}
