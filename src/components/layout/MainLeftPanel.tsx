"use client";
import React from "react";
import { HomeIcon, BuildingLibraryIcon } from "@heroicons/react/20/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MainLeftPanel() {
  const router = useRouter();
  return (
    <>
      {/* Side left panel */}
      <div
        id="main_left-panel"
        className="col-span-1 h-full bg-theme-lightBackground"
      >
        <div className="flex flex-col space-y-5 items-center justify-center pt-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={() => router.push("/")}
                className="p-2 hover:bg-theme-darkBackground rounded-md"
              >
                <HomeIcon className="w-6 h-6 text-black " />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="p-2 hover:bg-theme-darkBackground rounded-md">
                <Link href="/setup">
                  <BuildingLibraryIcon className="w-6 h-6 text-black " />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Connect Bank</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}
