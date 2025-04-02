
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ResetPasswordForm } from "../components/resetPasswordForm";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    token: z.string().nonempty("Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const ResetPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (password: string, confirmPassword: string) => {
    const validation = resetPasswordSchema.safeParse({
      token,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      alert(validation.error.errors[0]?.message || "Validation failed");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with token verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-background">
      <Card className="w-[400px] max-w-md">
        {isSuccess ? (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Password updated</h2>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully reset
            </p>
            <Link to="/login" className="text-sm text-primary hover:underline">
              Return to login
            </Link>
          </div>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Reset password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your new password below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResetPasswordForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};
