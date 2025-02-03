import React from "react";
import "@/styles/global.css";

export const metadata = {
  title: "FinSight Bank Setup",
  description: "Connecting your bank account",
};

export default function SetUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="setup"
      className="bg-theme-lightBackground h-screen w-screen overflow-hidden"
    >
      {children}
    </div>
  );
}
