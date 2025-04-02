import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiClient.get("/user/me");
      return response.data;
    },
    enabled: !!accessToken,
  });

  return { data, isLoading, error };
};
