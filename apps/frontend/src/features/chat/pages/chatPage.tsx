"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sidebar } from "../components/chatSidebar";
import { ChatInterface } from "../components/chatInterface";
import { mockConversations, mockMessages } from "@/lib/mockchats";


export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showConversations, setShowConversations] = useState(!isMobile);

  useEffect(() => {
    setShowConversations(!isMobile || !selectedConversation);
  }, [isMobile, selectedConversation]);

  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      senderId: "me",
      receiverId: selectedConversation || 1,
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  const handleConversationSelect = (id: number) => {
    setSelectedConversation(id);
    if (isMobile) {
      setShowConversations(false);
    }
  };

  const handleBackToConversations = () => {
    if (isMobile) {
      setShowConversations(true);
    }
  };

  return (
    <div className="flex h-screen  bg-white">
      {/* Sidebar - 20% width on desktop, full width on mobile when shown */}
      <div
        className={`
          ${isMobile ? "absolute inset-0 z-10" : "w-1/5"} 
          ${showConversations || !isMobile ? "block" : "hidden"}
          border-r border-gray-200 bg-white
        `}
      >
        <Sidebar
          conversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleConversationSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isMobile={isMobile}
        />
      </div>

      {/* Chat area - 80% width on desktop, full width on mobile */}
      <div
        className={`
          ${isMobile ? "w-full" : "w-4/5" }
          ${(!showConversations || !isMobile) && selectedConversation ? "block" : "hidden md:block"}
        `}
      >
        {selectedConversation && (
          <ChatInterface
            selectedConversation={selectedConversation}
            newMessage={newMessage}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onBackToConversations={handleBackToConversations}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}