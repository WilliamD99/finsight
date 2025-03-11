"use client";
import React from "react";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  LayoutDashboard,
  Wallet,
  LineChart,
  Target,
  Settings,
  Bell,
} from "lucide-react";

const data = [
  {
    title: "Dashboard",
    url: "/dashboard",
    isActive: true,
    icon: LayoutDashboard,
  },
  {
    title: "Accounts",
    url: "#",
    icon: Wallet,
    items: [
      {
        title: "Overview",
        url: "/accounts",
      },
      {
        title: "Connect Bank",
        url: "/setup/bank",
      },
      {
        title: "Import Transactions",
        url: "/setup/import",
      },
    ],
  },
  {
    title: "Analytics",
    icon: LineChart,
    url: "#",
    items: [
      {
        title: "Spending Analysis",
        url: "/analytics/spending",
      },
      {
        title: "Income Tracking",
        url: "/analytics/income",
      },
      {
        title: "Category Breakdown",
        url: "/analytics/categories",
      },
      {
        title: "Merchant Analysis",
        url: "/analytics/merchants",
      },
    ],
  },
  {
    title: "Planning",
    icon: Target,
    url: "#",
    items: [
      {
        title: "Budgets",
        url: "/planning/budgets",
      },
      {
        title: "Goals",
        url: "/planning/goals",
      },
      {
        title: "Savings Rules",
        url: "/planning/savings",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
    items: [
      {
        title: "Profile",
        url: "/settings/profile",
      },
      {
        title: "Preferences",
        url: "/settings/preferences",
      },
      {
        title: "Notifications",
        url: "/settings/notifications",
      },
      {
        title: "Connected Banks",
        url: "/settings/banks",
      },
    ],
  },
];

export default function MainNav() {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items ? (
              <Collapsible
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <div>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ) : (
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
