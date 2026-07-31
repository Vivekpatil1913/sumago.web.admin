"use client";

/** The signed-in user's own account: password and two-factor (Module 23). */
import { useState } from "react";
import { ApiError, api } from "@/lib/admin/api";
import { errorMessage, useApp, useToast } from "@/lib/admin/app-context";
import { Button, FieldError, Input, Label, Notice, Spinner } from "@/components/admin/ui";

export default function AccountPage() {
  const { user, loading } = useApp();
  const { notify } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [otpUrl, setOtpUrl] = useState<string | null>(null);
  const [code, setCode] = useState("");

  if (loading) return <Spinner />;
  if (!user) return null;

  // Mirrors the server rule: any role that can reach personal data needs a
  // second factor. Derived from permissions, not from the role's name.
  const twoFactorRequired =
    user.isAdmin ||
    ["applications", "enquiries", "users"].some(
      (key) => user.permissions?.[key]?.read || user.permissions?.[key]?.write,
    );

  async function changePassword() {
    setError(null);
    setFieldErrors({});

    if (newPassword !== confirm) {
      setFieldErrors({ confirm: "The two passwords do not match." });
      return;
    }

    setBusy(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      notify("Password changed. Your other sessions have been signed out.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
        setFieldErrors(caught.fieldErrors);
      } else {
        setError(errorMessage(caught));
      }
    } finally {
      setBusy(false);
    }
  }

  async function startTwoFactor() {
    setBusy(true);
    try {
      const response = await api.post<{ secret: string; otpauthUrl: string }>("/auth/2fa/setup");
      setSetupSecret(response.data.secret);
      setOtpUrl(response.data.otpauthUrl);
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  async function enableTwoFactor() {
    setBusy(true);
    try {
      await api.post("/auth/2fa/enable", { code });
      notify("Two-factor authentication is on.");
      setSetupSecret(null);
      setOtpUrl(null);
      setCode("");
    } catch (caught) {
      notify(errorMessage(caught), "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header>
        <h1 className="text-xl font-semibold text-content">Your account</h1>
        <p className="mt-0.5 text-sm text-muted">
          {user.name} · {user.email} · <span>{user.roleName}</span>
        </p>
      </header>

      <section className="space-y-4 admin-card p-5">
        <h2 className="text-sm font-semibold text-content">Change password</h2>
        {error ? <Notice tone="danger">{error}</Notice> : null}

        <div>
          <Label htmlFor="current" required>
            Current password
          </Label>
          <Input
            id="current"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="new" required>
            New password
          </Label>
          <Input
            id="new"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="mt-1"
          />
          <p className="mt-1 text-xs text-muted">At least 12 characters.</p>
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
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            className="mt-1"
          />
          {fieldErrors["confirm"] ? <FieldError>{fieldErrors["confirm"]}</FieldError> : null}
        </div>

        <Button variant="primary" loading={busy} onClick={() => void changePassword()}>
          Change password
        </Button>
        <p className="text-xs text-muted">
          Changing your password signs you out everywhere else.
        </p>
      </section>

      <section className="space-y-4 admin-card p-5">
        <h2 className="text-sm font-semibold text-content">Two-factor authentication</h2>

        {twoFactorRequired ? (
          <Notice tone="warn">
            Your role can see personal data, so two-factor authentication is required.
          </Notice>
        ) : (
          <p className="text-sm text-content-soft">
            Optional for your role, but recommended.
          </p>
        )}

        {setupSecret ? (
          <div className="space-y-3">
            <p className="text-sm text-content-soft">
              Add this key to your authenticator app, then enter the six-digit code it shows.
            </p>
            <code className="block break-all rounded bg-canvas-subtle px-3 py-2 font-mono text-xs text-content ring-1 ring-inset ring-line-soft">
              {setupSecret}
            </code>
            {otpUrl ? (
              <p className="break-all text-xs text-muted">
                Or open: <span className="font-mono">{otpUrl}</span>
              </p>
            ) : null}
            <div className="flex items-end gap-2">
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                  className="mt-1 w-32 tracking-[0.3em]"
                />
              </div>
              <Button variant="primary" loading={busy} onClick={() => void enableTwoFactor()}>
                Turn on
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" loading={busy} onClick={() => void startTwoFactor()}>
            Set up two-factor authentication
          </Button>
        )}
      </section>
    </div>
  );
}
