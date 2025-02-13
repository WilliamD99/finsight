import React from "react";
import Providers from "./provider";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <ScrollArea className="h-screen w-full relative">
          <Providers>{children}</Providers>
        </ScrollArea>
        <Toaster />
      </body>
    </html>
  );
}
