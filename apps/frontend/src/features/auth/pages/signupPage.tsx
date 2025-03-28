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
import { SignupForm } from "../components/signupForm";

interface SignupPageProps {
  onSignup: (userData: IUser) => void;
}

export const SignupPage = ({ onSignup }: SignupPageProps) => {
  return (
    <div className=" bg-background flex items-center justify-center w-[450px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm onSignup={onSignup} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
