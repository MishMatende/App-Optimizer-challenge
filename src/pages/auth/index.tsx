"use client";

import { KeyRound } from "lucide-react";
import { Button } from "~/lib/ui/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { supabaseBrowser } from "~/lib/supabase/browser";
import { FaGithub } from "react-icons/fa";
import { env } from "~/env";

export default function Page() {
  const handleLoginWithOAuth = (provider: "google" | "github") => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${env.HOME_URL}/auth/confirm`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-96 rounded-md border p-5 space-y-5">
        <div className="flex items-center gap-2">
          <KeyRound />
          <h1 className="text-2xl font-bold">App Optimizer</h1>
        </div>
        <p className="text-l text-gray-300">Register</p>
        <div className="flex flex-col gap-5">
          <Button
            className="w-full flex items-center gap-2"
            variant="outline"
            onClick={() => handleLoginWithOAuth("google")}
          >
            <FcGoogle /> Google
          </Button>
          <Button
            className="w-full flex items-center gap-2"
            variant="outline"
            onClick={() => handleLoginWithOAuth("github")}
          >
            <FaGithub /> GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
