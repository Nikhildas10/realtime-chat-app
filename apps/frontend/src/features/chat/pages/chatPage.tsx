import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Sidebar } from "../components/chatSidebar";
import { ChatInterface } from "../components/chatInterface";
import { useGetConversations } from "@/api/message/queries";
import { Conversation } from "@/lib/types";
import { useSocketStore } from "@/store/websocketStore";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/authStore";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [showConversations, setShowConversations] = useState(!isMobile);
  
  const { data: conversations } = useGetConversations();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const userId = useAuthStore((state) => state.userId);

  useSocket(userId as string);

  useEffect(() => {
    setShowConversations(!isMobile || !selectedConversation);
  }, [isMobile, selectedConversation]);

  const filteredConversations = conversations?.map((conversation: Conversation) => ({
    ...conversation,
    isOnline: onlineUsers.includes(conversation.id)
  })).filter(
    (conversation: Conversation) =>
      conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationSelect = (id: string) => {
    setSelectedConversation(id);
    if (isMobile) {
      setShowConversations(false);
    }
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-screen bg-white">
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

      <div
        className={`
          ${isMobile ? "w-full" : "w-4/5"}
          ${(!showConversations || !isMobile) && selectedConversation ? "block" : "hidden md:block"}
        `}
      >
        {selectedConversation && (
          <ChatInterface
            selectedConversation={selectedConversation}
            onBackToConversations={handleBackToConversations}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}
