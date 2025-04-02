import { useGenericMutation } from "@/hooks/useGenericMutation";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateUser = () => {
  return useGenericMutation({
    apiCall: (data) => apiClient.post("/user/register", data),
    onSuccessMessage: "User created successfully",
    // queryKeyToInvalidate:'users',
    redirectTo: "/login",
  });
};

export const useLoginUser = () => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiClient.post("/user/login", data),
    onSuccess: (data) => {
      setAccessToken(data.data.accessToken);
      navigate("/chat");
      toast.success("Login successful");
    },
    onError: (error) => {
      toast.error("Invalid credentials");
      console.error("Login error:", error);
    },
  });
};

export const useUpdateProfile = () => {
  return useGenericMutation({
    apiCall: (data: any) => apiClient.patch("/user/profile/" + data.id, data),
    onSuccessMessage: "Profile updated successfully",
    queryKeyToInvalidate: "user",
  });
};
