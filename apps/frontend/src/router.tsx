"use client";

import type React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IUser } from "./lib/types";
// import { LoginPage } from "./features/auth/pages/loginPage";
import { SignupPage } from "./features/auth/pages/signupPage";
// import { ChatPage } from "./features/chat/pages/chatPage";
import { Layout } from "./components/layout";
import { LoginPage } from "./features/auth/pages/loginPage";
import { ForgotPasswordPage } from "./features/auth/pages/forgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/pages/resetPasswordPage";
import ChatPage from "./features/chat/pages/chatPage";

// Simple auth check - in a real app, use a proper auth system
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
  }, []);

  return {
    isAuthenticated,
    login: (userData: IUser) => {
      localStorage.setItem("user", JSON.stringify(userData));
      setIsAuthenticated(true);
    },
    logout: () => {
      localStorage.removeItem("user");
      setIsAuthenticated(false);
    },
  };
};

// Protected route component
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };

export const Router = () => {
  const auth = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="login" element={<LoginPage onLogin={auth.login} />} />
          <Route path="signup" element={<SignupPage onSignup={auth.login} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            path="chat"
            element={
              // <ProtectedRoute>
                <ChatPage />
              // </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
