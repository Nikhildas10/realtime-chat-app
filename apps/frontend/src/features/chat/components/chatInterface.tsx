"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { mockConversations, mockMessages } from "@/lib/mockchats";
import { Message } from "@/lib/types";


interface ChatInterfaceProps {

  selectedConversation: number | null;
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onBackToConversations: () => void;
  isMobile: boolean;
}

export function ChatInterface({
  selectedConversation,
  newMessage,
  onMessageChange,
  onSendMessage,
  onBackToConversations,
  isMobile,
}: ChatInterfaceProps) {
  const currentConversation = mockConversations.find(
    (c) => c.id === selectedConversation
  );
  
  const messages=mockMessages?.filter((m:Message)=>
   {return m.receiverId==2  && m.senderId==selectedConversation || m.senderId==2 && m.receiverId==selectedConversation
  }) 
  
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
            src={currentConversation?.avatar || "/placeholder.svg"}
            alt="Contact"
          />
        </Avatar>
        <div className="flex-1">
          <h2 className="font-medium text-black">
            {currentConversation?.name}
          </h2>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>
      {/* Messages area - flexible and scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages?.map((message:Message) => (
              <div
                key={message.id}
                className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg ${
                    message.isMe
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-100 text-black rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${message.isMe ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            {/* Invisible element at the end to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {/* Message input - fixed height at bottom */}
      <div className="p-4 border-t border-gray-200 shrink-0">
        <form onSubmit={onSendMessage} className="flex space-x-2">
          <Input
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            className="flex-1 border-black focus-visible:ring-black"
          />
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
