"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/shared/ui/button";

const THEME_EVENT = "dc-theme-change";

function subscribe(callback: () => void): () => void {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "light" | "dark" {
  return "light";
}

/**
 * Nút chuyển sáng/tối. Đọc trạng thái trực tiếp từ class trên <html>
 * qua useSyncExternalStore (class đã được inline script set trước hydrate).
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // bỏ qua nếu localStorage không dùng được
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      title={theme === "dark" ? "Chuyển sáng" : "Chuyển tối"}
      aria-label="Đổi giao diện sáng/tối"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
