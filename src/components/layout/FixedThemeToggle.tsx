"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function FixedThemeToggle() {
  return (
    <div className="fixed top-2 right-4 z-[100] bg-transparent p-2">
      <ThemeToggle />
    </div>
  );
}
