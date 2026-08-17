"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";

import { useRequestOtp, useVerifyOtp } from "../api/mutations";

type Step = "username" | "otp";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("username");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    try {
      await requestOtp.mutateAsync(username.trim());
      setStep("otp");
      setInfo("Đã gửi OTP tới email đã đăng ký. Vui lòng kiểm tra hộp thư.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gửi được OTP");
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await verifyOtp.mutateAsync({ username: username.trim(), code: code.trim() });
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP không đúng");
    }
  }

  async function handleResend() {
    setError(null);
    setInfo(null);
    try {
      await requestOtp.mutateAsync(username.trim());
      setInfo("Đã gửi lại OTP.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không gửi được OTP");
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Đăng nhập</CardTitle>
        <CardDescription>
          {step === "username"
            ? "Nhập username để nhận mã OTP qua email."
            : "Nhập mã OTP gồm 6 chữ số vừa được gửi."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "username" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={requestOtp.isPending || username.trim().length === 0}
            >
              {requestOtp.isPending ? <Spinner /> : null}
              Gửi OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Mã OTP</Label>
              <Input
                id="otp"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="••••••"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                required
                autoFocus
              />
            </div>
            {info ? <p className="text-sm text-muted-foreground">{info}</p> : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={verifyOtp.isPending || code.trim().length < 4}
            >
              {verifyOtp.isPending ? <Spinner /> : null}
              Đăng nhập
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setStep("username");
                  setCode("");
                  setError(null);
                  setInfo(null);
                }}
              >
                ← Đổi username
              </button>
              <button
                type="button"
                className="text-primary hover:underline disabled:opacity-50"
                onClick={handleResend}
                disabled={requestOtp.isPending}
              >
                Gửi lại OTP
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
