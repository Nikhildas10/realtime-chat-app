import type React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignupPage } from "./features/auth/pages/signupPage";
import { Layout } from "./components/layout";
import { LoginPage } from "./features/auth/pages/loginPage";
import { ForgotPasswordPage } from "./features/auth/pages/forgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/pages/resetPasswordPage";
import ChatPage from "./features/chat/pages/chatPage";
import { useAuthStore } from "./store/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
