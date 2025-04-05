"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Check, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";
import { useGetMessages } from "@/api/message/queries";
import { useMarkMessagesAsSeen, useSendMessage } from "@/api/message/mutations";
import { useAuthStore } from "@/store/authStore";
import { groupMessagesByDate } from "@/lib/dateFormat";

interface ChatInterfaceProps {
  selectedConversation: string;
  onBackToConversations: () => void;
  isMobile: boolean;
}

export function ChatInterface({
  selectedConversation,
  onBackToConversations,
  isMobile,
}: ChatInterfaceProps) {
  const { data } = useGetMessages(selectedConversation);
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { mutate: markMessagesAsSeen } = useMarkMessagesAsSeen();
  const messages = data?.messages;
  const recipient = data?.recipient;

  const userId = useAuthStore((state) => state.userId);

  const [newMessage, setNewMessage] = useState("");
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Create a ref to track if initial scroll has happened
  const hasScrolledToBottomRef = useRef(false);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    sendMessage(
      {
        receiverId: selectedConversation,
        text: newMessage.trim(),
      },
      {
        onSuccess: () => {
          setNewMessage("");
          scrollToBottom();
        },
      }
    );
  };

  const groupedMessages = messages ? groupMessagesByDate(messages) : [];

  // Scroll to bottom when messages change or on initial load
  useEffect(() => {
    if (messages?.length && !hasScrolledToBottomRef.current) {
      // For initial load, use immediate scroll without animation
      messagesEndRef.current?.scrollIntoView();
      hasScrolledToBottomRef.current = true;
    } else if (messages?.length) {
      // For subsequent updates, use smooth scrolling
      scrollToBottom();
    }
  }, [messages]);

  // Reset the scroll flag when conversation changes
  useEffect(() => {
    hasScrolledToBottomRef.current = false;
  }, [selectedConversation]);

  useEffect(() => {
    if (
      selectedConversation &&
      messages?.some(
        (message: Message) =>
          message.senderId === selectedConversation && message.status === "SENT"
      )
    ) {
      markMessagesAsSeen(selectedConversation);
    }
  }, [selectedConversation, messages, markMessagesAsSeen]);

  return (
    <div className="flex flex-col h-[100vh]">
      {/* Header - fixed height */}
      <div className="p-4 border-b border-gray-200 flex items-center h-16 shrink-0">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-black"
            onClick={onBackToConversations}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Button>
        )}
        <Avatar className="h-10 w-10 mr-3">
          <img
            src={recipient?.avatar }
            alt={recipient?.username}
          />
          <AvatarFallback>{recipient?.username?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-medium text-black">{recipient?.username}</h2>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>
      {/* Messages area - flexible and scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {groupedMessages.map((group: any) => (
              <div key={group.date} className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {group.date}
                  </div>
                </div>
                {group.messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg ${
                        message.senderId === userId
                          ? "bg-black text-white rounded-br-none"
                          : "bg-gray-100 text-black rounded-bl-none"
                      }`}
                    >
                      <p>{message.text}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1.5">
                        <p
                          className={`text-xs ${message.senderId === userId ? "text-gray-300" : "text-gray-500"}`}
                        >
                          {message.time}
                        </p>

                        {message.senderId === userId && message.status && (
                          <span className="flex items-center">
                            {message.status === "READ" ? (
                              <div className="relative">
                                <CheckCheck className="h-4 w-4 text-emerald-400 drop-shadow-sm" />
                              </div>
                            ) : (
                              <div className="relative">
                                <Check className="h-4 w-4 text-gray-300 drop-shadow-sm" />
                              </div>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {/* Message input - fixed height at bottom */}
      <div className="p-4 shrink-0">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isPending}
            className="flex-1 border-black focus-visible:ring-black"
          />
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800"
            disabled={isPending || newMessage.trim() === ""}
          >
            {isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
