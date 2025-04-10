import { useGenericMutation } from "@/hooks/useGenericMutation";
import apiClient from "@/lib/axios";

export const useSendMessage = () => {
  return useGenericMutation({
    apiCall: (data) => apiClient.post("/message", data),
    queryKeyToInvalidate: ["messages", "conversations"],
  });
};

export const useMarkMessagesAsSeen = () => {
  return useGenericMutation({
    apiCall: (senderId: string) => apiClient.patch(`/message/seen/${senderId}`),
    queryKeyToInvalidate: ["conversations", "messages"],
  });
};
