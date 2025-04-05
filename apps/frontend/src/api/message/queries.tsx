import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await apiClient.get("/message");
      return response.data;
    },
  });
};

export const useGetMessages = (receiverId: string) => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const response = await apiClient.get(`/message/${receiverId}`);
      return response.data;
    },
  });
};
