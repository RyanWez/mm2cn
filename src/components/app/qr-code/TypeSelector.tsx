import { motion } from "framer-motion";
import { Link, FileText, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { QRType } from "./types";

interface TypeSelectorProps {
  selectedType: QRType;
  onTypeChange: (type: QRType) => void;
}

export function TypeSelector({ selectedType, onTypeChange }: TypeSelectorProps) {
  const types = [
    { id: "url" as QRType, label: "URL", icon: Link },
    { id: "text" as QRType, label: "Text", icon: FileText },
    { id: "wifi" as QRType, label: "Wi-Fi", icon: Wifi },
  ];

  return (
    <div className="flex p-1 bg-muted/50 rounded-xl relative">
      {types.map((type) => {
        const Icon = type.icon;
        const isActive = selectedType === type.id;

        return (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 h-10 text-sm font-medium transition-colors z-10",
              isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground/80"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
