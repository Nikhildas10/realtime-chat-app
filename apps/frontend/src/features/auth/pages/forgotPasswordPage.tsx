
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ForgotPasswordForm } from "../components/forgotPasswordForm";

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmail(data.email);
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 flex items-center justify-center bg-background">
      <Card className="w-[400px] max-w-md">
        {emailSent ? (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent password reset instructions to{" "}
              <span className="font-semibold">{email}</span>.
            </p>
            <Link to="/login" className="text-sm text-primary hover:underline">
              Return to login
            </Link>
          </div>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Forgot password?
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:underline"
              >
                Back to login
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};
