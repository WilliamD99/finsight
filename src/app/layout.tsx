import React from "react";
import Providers from "./provider";
import { Toaster } from "@/components/ui/toaster";
import LinkUpdate from "@/components/plaid-link/update";
// import { ScrollArea } from "@/components/ui/scroll-area";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {/* <ScrollArea className="h-screen w-full relative"> */}
        <Providers>
          <LinkUpdate>{children}</LinkUpdate>
          {/* {children} */}
        </Providers>
        {/* </ScrollArea> */}
        <Toaster />
      </body>
    </html>
  );
}
