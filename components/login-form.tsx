"use client";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function LoginForm() {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google");
    }
  };
  const handleGithubSignIn = async () => {
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with GitHub");
    }
  };
  return (
    <div className="flex flex-col gap-6 max-w-sm mx-auto">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to Chat App
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in or create an account
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          type="button"
          className="w-full gap-2 h-11"
          onClick={handleGoogleSignIn}
        >
          <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.7 1.22 9.2 3.6l6.9-6.9C35.98 2.42 30.38 0 24 0 14.82 0 6.88 5.48 2.94 13.44l8.02 6.23C13.1 13.48 18.13 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.14 24.5c0-1.56-.14-3.06-.4-4.5H24v9h12.44c-.54 2.9-2.18 5.36-4.64 7.04l7.12 5.54C43.98 36.9 46.14 31.2 46.14 24.5z"
            />
            <path
              fill="#4A90E2"
              d="M10.96 28.67A14.5 14.5 0 019.5 24c0-1.63.28-3.2.78-4.67l-8.02-6.23A23.92 23.92 0 000 24c0 3.93.94 7.65 2.6 10.94l8.36-6.27z"
            />
            <path
              fill="#FBBC05"
              d="M24 48c6.48 0 11.92-2.14 15.9-5.8l-7.12-5.54c-2 1.34-4.56 2.14-8.78 2.14-5.87 0-10.9-3.98-12.7-9.34l-8.36 6.27C6.88 42.52 14.82 48 24 48z"
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          type="button"
          className="w-full gap-2 h-11"
          onClick={handleGithubSignIn}
        >
          <Github size={18} />
          Continue with GitHub
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground leading-relaxed">
        By continuing, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
