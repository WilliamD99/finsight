"use client";
import React, { useEffect, useState } from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { HousePlus, LandmarkIcon, Settings2 } from "lucide-react";
import useInstitutions from "@/hooks/use-institutions";
import { Institution } from "plaid";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

export default function AccountSwitcher() {
  const { isMobile } = useSidebar();
  const [activeAccount, setActiveAccount] = useState<Institution>();
  const [connectedAccount, setConnectedAccount] = useState<Institution[]>([]);
  const { data, error, isLoading } = useInstitutions();
  const { toast } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    if (data) setConnectedAccount(data.institutions);
    if (error)
      toast({
        title: "Error getting bank accounts",
        description:
          "Something went wrong when we try to retrieve your connected bank data, please try again.",
        variant: "destructive",
      });
  }, [data]);

  useEffect(() => {
    if (pathname.includes("dashboard") && connectedAccount.length > 0) {
      let currentPath = pathname.split("/");
      if (currentPath[2] && currentPath[2] !== "") {
        // Need to extract the id from the string (in case the path contain params)
        let currentId = currentPath[2].split("?")[0];
        let currentAccount = connectedAccount.find(
          (account) => account.institution_id === currentId
        );
        setActiveAccount(currentAccount);
      }
    }
  }, [pathname, connectedAccount]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <activeTeam.logo className="size-4" /> */}
              </div>
              <div className="grid flex-1 gap-y-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">FinSight</span>
                <span className="truncate text-xs">
                  {isLoading ? (
                    <Skeleton className="w-20 h-4" />
                  ) : (
                    <>{activeAccount?.name ?? "Summary"}</>
                  )}
                </span>
              </div>
              <Settings2 />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Your accounts
            </DropdownMenuLabel>
            <Link href="/dashboard">
              <DropdownMenuItem
                className={`gap-2 p-2 font-semibold cursor-pointer hover:bg-sidebar-accent ${
                  !activeAccount && "bg-sidebar-accent"
                }`}
              >
                <div className="flex size-8 items-center justify-center rounded-sm relative">
                  <LandmarkIcon className="size-4" />
                </div>
                Summary
              </DropdownMenuItem>
            </Link>
            {connectedAccount.length > 0 &&
              connectedAccount.map((account) => (
                <Link
                  key={account.name}
                  href={`/dashboard/${account.institution_id}`}
                >
                  <DropdownMenuItem
                    key={account.name}
                    className={`gap-2 p-2 font-semibold cursor-pointer hover:bg-sidebar-accent ${
                      activeAccount?.institution_id ===
                        account.institution_id && "bg-sidebar-accent"
                    }`}
                  >
                    <div className="flex size-8 items-center justify-center rounded-sm relative">
                      <Image
                        fill
                        src={`/institution_logo/${account.institution_id}.svg`}
                        alt={`${account.name} logo`}
                      />
                    </div>
                    {account.name}
                  </DropdownMenuItem>
                </Link>
              ))}
            <DropdownMenuSeparator />
            <Link href="/setup/bank" className="font-medium">
              <DropdownMenuItem className="gap-2 p-2 cursor-pointer hover:bg-sidebar-accent">
                <div className="flex size-8 items-center justify-center rounded-md border bg-background">
                  <HousePlus className="size-4" />
                </div>
                Connect Account
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
