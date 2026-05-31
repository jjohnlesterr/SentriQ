"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/teacher/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="dangerSoft" onClick={handleLogout}>
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}