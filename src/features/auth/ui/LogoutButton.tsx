"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

import { useLogout } from "../api/mutations";

export function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useLogout();

  async function handleLogout() {
    await logout.mutateAsync();
    queryClient.clear();
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={logout.isPending}
    >
      {logout.isPending ? <Spinner /> : <LogOut />}
      Đăng xuất
    </Button>
  );
}
