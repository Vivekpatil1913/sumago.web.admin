"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/admin/api";
import { errorMessage } from "@/lib/admin/app-context";
import { Button, Input, Label, Notice } from "@/components/admin/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-content">Reset your password</h1>
          <p className="mt-1.5 text-[13px] text-muted">
            We&rsquo;ll email you a link to set a new one.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {error ? <Notice tone="danger">{error}</Notice> : null}
          {sent ? (
            <Notice tone="ok" title="Check your inbox">
              If that address has an account, a reset link is on its way. The link expires in 60 minutes.
            </Notice>
          ) : (
            <>
              <div>
                <Label htmlFor="email" required>
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  autoFocus
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-1.5"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" loading={submitting} block>
                Send reset link
              </Button>
            </>
          )}

          <p className="text-center text-xs text-muted">
            <Link href="/admin/login" className="text-accent underline-offset-2 hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
    </>
  );
}
