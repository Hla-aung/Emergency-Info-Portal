import { Message } from "@/hooks/use-chatbot";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import Markdown from "react-markdown";
import TypeIt from "typeit-react";

const MessageComponent = ({
  message,
  isLastMessage,
  index,
}: {
  message: Message;
  isLastMessage: boolean;
  index: number;
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      key={message.id}
      className={cn(
        "flex gap-3",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {message.role === "assistant" && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap">
          <Markdown>{message.content}</Markdown>

          {message.role === "assistant" && message.content === "" && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
          )}
        </div>
        <p className="text-xs opacity-70 mt-1">
          {formatTime(message.timestamp)}
        </p>
      </div>
      {message.role === "user" && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
