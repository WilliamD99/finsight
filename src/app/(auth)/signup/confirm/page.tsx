"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ConfirmSignup() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 w-[1000px] md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={"flex flex-col gap-6"}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8 col-span-2">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Account Registered</h1>
                  <p className="text-balance text-sm text-muted-foreground">
                    You have successfully registered your account.
                  </p>
                  <p className="mt-4 text-sm">
                    Please check your inbox to verify your account.
                  </p>
                  <Button
                    onClick={() => router.push("/login")}
                    className="mt-4"
                  >
                    Return to login page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
