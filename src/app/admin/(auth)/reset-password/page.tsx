"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, api } from "@/lib/admin/api";
import { Button, FieldError, FieldHelp, Input, Label, Notice, Spinner } from "@/components/admin/ui";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirm) {
      setFieldErrors({ confirm: "The two passwords do not match." });
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      window.setTimeout(() => router.replace("/admin/login"), 2000);
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
        setFieldErrors(caught.fieldErrors);
      } else {
        setError("Cannot reach the server.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <Notice tone="danger" title="Missing reset link">
        Open the link from your email, or{" "}
        <Link href="/admin/forgot-password" className="underline">
          request a new one
        </Link>
        .
      </Notice>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Notice tone="danger">{error}</Notice> : null}
      {done ? (
        <Notice tone="ok" title="Password updated">
          Taking you to the sign-in page…
        </Notice>
      ) : (
        <>
          <div>
            <Label htmlFor="password" required>
              New password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              autoFocus
              value={password}
              invalid={Boolean(fieldErrors["password"])}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5"
            />
            <FieldHelp>At least 12 characters.</FieldHelp>
            {fieldErrors["password"] ? <FieldError>{fieldErrors["password"]}</FieldError> : null}
          </div>

          <div>
            <Label htmlFor="confirm" required>
              Confirm new password
            </Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              invalid={Boolean(fieldErrors["confirm"])}
              onChange={(event) => setConfirm(event.target.value)}
              className="mt-1.5"
            />
            {fieldErrors["confirm"] ? <FieldError>{fieldErrors["confirm"]}</FieldError> : null}
          </div>

          <Button type="submit" variant="primary" size="lg" loading={submitting} block>
            Set new password
          </Button>
        </>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-content">Choose a new password</h1>
        <p className="mt-1.5 text-[13px] text-muted">
          Pick something you don&rsquo;t use anywhere else.
        </p>
      </div>
      <Suspense fallback={<Spinner />}>
        <ResetForm />
      </Suspense>
    </>
  );
}
