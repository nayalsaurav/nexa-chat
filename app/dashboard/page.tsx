import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardChatInput } from "@/components/dashboard/dashboard-chat-input";
import { EmptyChatState } from "@/components/dashboard/chat/empty-chat-state";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/signin");
  }

  const firstName = session.user.name?.split(" ")[0] ?? "there";

  return (
    <EmptyChatState title={`Welcome back, ${firstName}`}>
      <DashboardChatInput />
    </EmptyChatState>
  );
}
