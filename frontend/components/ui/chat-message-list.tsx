import React from "react";
import { cn } from "@/lib/utils";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-3 p-4", className)} {...props}>
    {children}
  </div>
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };