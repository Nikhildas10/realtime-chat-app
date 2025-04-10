import { useSocketStore } from "@/store/websocketStore";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

export const useSocket = (userId: string) => {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const setOnlineUsers = useSocketStore((state) => state.setOnlineUsers);
  const setTypingFrom = useSocketStore((state) => state.setTypingFrom);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    const onConnect = () => {
      console.log("🔌 Connected to socket:", socket.id);
      socket.emit("identity", userId);
    };

    const onOnlineUsers = (users: string[]) => {
      console.log("👥 Online users:", users);
      setOnlineUsers(users);
    };

    const onTyping = ({
      from,
      isTyping,
    }: {
      from: string;
      isTyping: boolean;
    }) => {
      console.log(`✍️ ${from} is ${isTyping ? "typing" : "stopped typing"}`);
      setTypingFrom(isTyping ? from : null);
    };

    const onReceiveMessage = () => {
      console.log("📩 Received new message, invalidating queries...");
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    const onMessageStatusUpdate = ({
      partnerId,
      status,
    }: {
      partnerId: string;
      status: "DELIVERED" | "READ";
    }) => {
      console.log(`📬 Message status updated for ${partnerId} to ${status}`);
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    };

    socket.on("connect", onConnect);
    socket.on("online_users", onOnlineUsers);
    socket.on("typing", onTyping);
    socket.on("receive_message", onReceiveMessage);
    socket.on("message_status_updated", onMessageStatusUpdate);

    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.off("connect", onConnect);
      socket.off("online_users", onOnlineUsers);
      socket.off("typing", onTyping);
      socket.off("receive_message", onReceiveMessage);
      socket.off("message_status_updated", onMessageStatusUpdate);
      socket.disconnect();
    };
  }, [userId, setOnlineUsers, setTypingFrom, queryClient]);
  
  const emitTyping = useCallback(
    (to: string, isTyping: boolean) => {
      console.log(`✍️ Emitting typing status to ${to}: ${isTyping}`);
      socketRef.current?.emit("typing", { from: userId, to, isTyping });
    },
    [userId]
  );

  return {
    socket: socketRef.current,
    emitTyping,
    emitMessage: (to: string) => {
      console.log("📤 Emitting message to:", to);
      socketRef.current?.emit("send_message", { to });
    },
    isConnected: socketRef.current?.connected,
  };
};
