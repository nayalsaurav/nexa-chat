"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
  props: React.ComponentProps<typeof ThemeProvider>;
}

export function Providers({ children, props }: ProvidersProps) {
  return (
    <ThemeProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
