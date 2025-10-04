import React from "react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  className,
  variant = "received",
  children,
  ...props
}) => (
  <div
    className={cn(
      "flex w-full max-w-xs gap-2 rounded-lg p-3 text-sm",
      variant === "sent" ? "ml-auto flex-row-reverse" : "flex-row",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

ChatBubble.displayName = "ChatBubble";

interface ChatBubbleAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  className,
  src,
  fallback,
  ...props
}) => (
  <div
    className={cn(
      "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted text-xs font-medium",
      className
    )}
    {...props}
  >
    {src ? (
      <img src={src} alt="Avatar" className="h-full w-full rounded-full object-cover" />
    ) : (
      fallback
    )}
  </div>
);

ChatBubbleAvatar.displayName = "ChatBubbleAvatar";

interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  isLoading?: boolean;
}

const ChatBubbleMessage: React.FC<ChatBubbleMessageProps> = ({
  className,
  variant = "received",
  isLoading,
  children,
  ...props
}) => (
  <div
    className={cn(
      "rounded-lg px-3 py-2 text-sm",
      variant === "sent"
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground",
      className
    )}
    {...props}
  >
    {isLoading ? (
      <div className="flex items-center space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
      </div>
    ) : (
      children
    )}
  </div>
);

ChatBubbleMessage.displayName = "ChatBubbleMessage";

export { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage };