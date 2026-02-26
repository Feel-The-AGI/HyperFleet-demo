import { type ElementType, useEffect, useState } from "react";
import { Monitor, Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const order = ["light", "dark", "system"] as const;
type Mode = (typeof order)[number];

const iconByMode: Record<Mode, ElementType> = {
  light: SunMedium,
  dark: Moon,
  system: Monitor,
};

export function ThemeToggle() {
  const { theme = "system", setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (theme as Mode) ?? "system";
  const Icon = iconByMode[current];

  if (!mounted) {
    return <Button variant="ghost" size="icon" aria-label="Theme mode" className="h-9 w-9" />;
  }

  const next = order[(order.indexOf(current) + 1) % order.length];

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      aria-label={`Switch theme (current: ${current})`}
      onClick={() => setTheme(next)}
      title={`Theme: ${current} (click for ${next})`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}
