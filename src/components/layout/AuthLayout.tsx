"use client";

import React from "react";
import "@/styles/global.css";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        id="auth"
        className="h-screen w-screen bg-theme-lightBackground overflow-hidden flex justify-center items-center"
      >
        {/* <Card className="w-[400px]">
          <form>
            <CardHeader className="text-center space-y-2 flex flex-col justify-center items-center p-4 px-10">
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">Sign in with email</CardTitle>
              <CardDescription className="text-sm">
                Make a new doc to bring your words, data, and teams together.
                For free
              </CardDescription>
            </CardHeader>
            {children}
          </form>
        </Card> */}
        {children}
      </div>
    </>
  );
}
