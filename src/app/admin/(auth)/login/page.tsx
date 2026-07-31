"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, KeyRound } from "lucide-react";
import { ApiError, api } from "@/lib/admin/api";
import { Button, FieldError, Input, Label, Notice, PasswordInput } from "@/components/admin/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      await api.post("/auth/login", { email, password, ...(needsCode ? { code } : {}) });
      // The panel dashboard — not "/", which is the public website.
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      if (caught instanceof ApiError) {
        // The server asks for a second factor by code, not by message parsing.
        if (caught.code === "TWO_FACTOR_REQUIRED") {
          setNeedsCode(true);
          setError(caught.message);
        } else {
          setError(caught.message);
          setFieldErrors(caught.fieldErrors);
        }
      } else {
        setError("Cannot reach the server. Check that the API is running.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-content">Welcome back</h1>
        <p className="mt-1.5 text-[13px] text-muted">Sign in to manage the Sumago website.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {error ? <Notice tone="danger">{error}</Notice> : null}

        <div>
          <Label htmlFor="email" required>
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@sumagoinfotech.com"
            autoFocus
            required
            value={email}
            invalid={Boolean(fieldErrors["email"])}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5"
          />
          {fieldErrors["email"] ? <FieldError>{fieldErrors["email"]}</FieldError> : null}
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-2">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Link
              href="/admin/forgot-password"
              className="text-xs text-muted underline-offset-2 transition-colors hover:text-accent hover:underline"
            >
              Forgotten?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            invalid={Boolean(fieldErrors["password"])}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5"
          />
          {fieldErrors["password"] ? <FieldError>{fieldErrors["password"]}</FieldError> : null}
        </div>

        {needsCode ? (
          <div className="rounded-[var(--radius-card)] bg-canvas-subtle p-3.5">
            <Label htmlFor="code" required>
              <span className="inline-flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5" aria-hidden />
                Authentication code
              </span>
            </Label>
            <Input
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
              className="mt-1.5 text-center text-lg tracking-[0.4em]"
            />
            <p className="mt-1.5 text-xs text-muted">
              Roles that can see personal data use two-factor authentication.
            </p>
          </div>
        ) : null}

        <Button type="submit" variant="primary" size="lg" loading={submitting} block className="mt-1">
          Sign in
          {!submitting ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted">
        Sessions end after 8 hours of inactivity.
      </p>
    </>
  );
}
