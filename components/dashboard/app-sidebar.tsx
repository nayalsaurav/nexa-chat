"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { SidebarHeader as Header } from "@/components/dashboard/sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "next-auth";

export function AppSidebar({
  user,
  conversations,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
  conversations: { id: string; title: string }[];
}) {
  const navMain = [
    {
      title: "Your Chats",
      url: "#",
      icon: MessageCircle,
      isActive: true,
      items: conversations.map((conv) => ({
        id: conv.id,
        title: conv.title,
        url: `/dashboard/chat/${conv.id}`,
      })),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Header />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
