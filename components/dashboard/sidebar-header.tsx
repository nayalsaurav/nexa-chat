"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Plus, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateConversation } from "@/app/dashboard/actions";
import { toast } from "sonner";

export function SidebarHeader() {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const handleNewChat = async () => {
    try {
      const id = await generateConversation();
      toast.success("New chat created");
      router.push(`/dashboard/chat/${id}`);
      setOpenMobile(false);
    } catch (error) {
      toast.error("Failed to create new chat");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <MessageCircle className="size-5" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-lg">Chat App</span>
          </div>
        </div>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
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
