import React from "react";
import Providers from "./provider";
import { Toaster } from "@/components/ui/toaster";
import LinkUpdate from "@/components/plaid-link/update";
import FixedThemeToggle from "@/components/layout/FixedThemeToggle";
// import { ScrollArea } from "@/components/ui/scroll-area";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* <ScrollArea className="h-screen w-full relative"> */}
        <Providers>
          <FixedThemeToggle />
          <LinkUpdate>{children}</LinkUpdate>
          {/* {children} */}
        </Providers>
        {/* </ScrollArea> */}
        <Toaster />
      </body>
    </html>
  );
}
