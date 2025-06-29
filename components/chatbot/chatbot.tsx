"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Loader2,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import QuickActions from "./quick-actions";
import { useChatbot } from "@/hooks/use-chatbot";
import Markdown from "react-markdown";
import MessageComponent from "./message";

interface ChatbotProps {
  className?: string;
}

const Chatbot = ({ className }: ChatbotProps) => {
  const {
    messages,
    isOpen,
    isMinimized,
    isLoading,
    sendMessage,
    toggleChat,
    toggleMinimize,
    resetChat,
  } = useChatbot();

  const [inputValue, setInputValue] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content || isLoading) return;

    setInputValue("");
    setShowQuickActions(false);
    await sendMessage(content);
  };

  const handleQuickAction = (query: string) => {
    handleSendMessage(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    resetChat();
    setShowQuickActions(true);
  };

  return (
    <div
      className={cn("fixed bottom-20 right-5 z-[500] flex flex-col", className)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-2"
          >
            <Card className="w-80 shadow-xl border-2">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">
                      Emergency Assistant
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleChat}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-3 h-[70svh]">
                <ScrollArea
                  ref={scrollAreaRef}
                  className="mb-4 pr-4 h-[calc(70svh-100px)]"
                >
                  <div className="space-y-4">
                    {messages.map((message, i, arr) => (
                      <MessageComponent
                        key={message.id}
                        message={message}
                        isLastMessage={arr.length - 1 === i}
                        index={i}
                      />
                    ))}
                    {showQuickActions && messages.length === 1 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            Quick Actions
                          </span>
                        </div>
                        <QuickActions
                          onActionClick={handleQuickAction}
                          disabled={isLoading}
                        />
                      </div>
                    )}
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about emergency procedures, shelters..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {messages.length > 1 && (
                  <div className="mt-2 flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetChat}
                      className="text-xs"
                    >
                      Start New Chat
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleChat}
        size="icon"
        className="rounded-full shadow-lg bg-primary hover:bg-primary/90 self-end"
        aria-label="Open chatbot"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Chatbot;
