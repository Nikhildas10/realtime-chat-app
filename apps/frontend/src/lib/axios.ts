import axios, { AxiosResponse, AxiosError } from "axios";
import { BASE_URL } from "./config";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
});

const getToken = () => {
  return useAuthStore.getState().accessToken;
};

apiClient.interceptors.request.use(
  (config: any) => {
    const token = getToken();
    if (!config?.url?.includes("/login") && !config?.url?.includes("/signup")) {
      if (token) {
        config.headers = config.headers || {};
        config.headers.authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
