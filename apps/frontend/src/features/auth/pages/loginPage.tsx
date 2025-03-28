import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IUser } from "@/lib/types";
import { LoginForm } from "../components/loginForm";

interface LoginPageProps {
  onLogin: (userData: IUser) => void;
}

export const LoginPage = ({ onLogin }: LoginPageProps) => {
  return (
    <div className="min-h-full flex items-center justify-center w-full bg-background">
      <div className="bg-background flex items-center justify-center w-[450px] p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onLogin={onLogin} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-primary underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
