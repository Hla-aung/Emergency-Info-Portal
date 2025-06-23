"use client";

import { useState, useEffect } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatbotState {
  messages: Message[];
  isOpen: boolean;
  isMinimized: boolean;
  isLoading: boolean;
}

interface UseChatbotReturn extends ChatbotState {
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  toggleMinimize: () => void;
  resetChat: () => void;
  addMessage: (message: Message) => void;
}

const STORAGE_KEY = "emergency-chatbot-history";
const MAX_MESSAGES = 50;

export const useChatbot = (): UseChatbotReturn => {
  const [state, setState] = useState<ChatbotState>({
    messages: [
      {
        id: "1",
        content:
          "Hello! I'm your emergency assistance AI. I can help you with information about shelters, emergency procedures, and safety tips. How can I assist you today?",
        role: "assistant",
        timestamp: new Date(),
      },
    ],
    isOpen: false,
    isMinimized: false,
    isLoading: false,
  });

  // Load chat history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setState((prev) => ({
          ...prev,
          messages: messagesWithDates,
        }));
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          messages: state.messages,
        })
      );
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  }, [state.messages]);

  const addMessage = (message: Message) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message].slice(-MAX_MESSAGES),
    }));
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: state.messages.slice(-10).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const toggleChat = () => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleMinimize = () => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const resetChat = () => {
    const initialMessage: Message = {
      id: "1",
      content:
        "Hello! I'm your emergency assistance AI. I can help you with information about shelters, emergency procedures, and safety tips. How can I assist you today?",
      role: "assistant",
      timestamp: new Date(),
    };
    setState((prev) => ({
      ...prev,
      messages: [initialMessage],
    }));
  };

  return {
    ...state,
    sendMessage,
    toggleChat,
    toggleMinimize,
    resetChat,
    addMessage,
  };
};
