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
      aria-label="Đăng xuất"
      title="Đăng xuất"
      // Trên mobile chỉ còn icon: header cao cố định, giữ cả nhãn thì thanh
      // điều hướng bên trái hết chỗ và chữ bị xuống dòng.
      className="max-sm:gap-0 max-sm:px-2"
    >
      {logout.isPending ? <Spinner /> : <LogOut />}
      <span className="hidden sm:inline">Đăng xuất</span>
    </Button>
  );
}
