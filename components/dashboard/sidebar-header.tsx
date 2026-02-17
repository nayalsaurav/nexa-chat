"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { generateConversation } from "@/app/dashboard/actions";
import { toast } from "sonner";

export function SidebarHeader() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleNewChat = async () => {
    try {
      const result = await generateConversation();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("New chat created");
      router.push(`/dashboard/chat/${result.id}`);
      setOpenMobile(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <Link href="/">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
              <Image
                src="/logo.png"
                alt="Nexa Chat"
                width={40}
                height={40}
                priority
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold text-lg">Nexa Chat</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem className="mt-2 mb-0 pb-0">
        <SidebarMenuButton
          size="lg"
          tooltip="New Chat"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={handleNewChat}
        >
          <div className="bg-sidebar-accent text-sidebar-accent-foreground flex aspect-square size-8 items-center justify-center rounded-lg border border-sidebar-border">
            <Plus className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">New Chat</span>
            <span className="truncate text-xs">Start a conversation</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
