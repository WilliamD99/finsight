import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { NavUser } from "./NavUser";
import AccountSwitcher from "./AccountSwitcher";
import { getUserData } from "@/utils/server-utils/actions";
import MainNav from "./MainNav";

export default async function MainSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await getUserData();

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AccountSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  );
}
