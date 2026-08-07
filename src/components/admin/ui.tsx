"use client";

/**
 * Admin UI primitives.
 *
 * Everything speaks in semantic tokens (surface / content / line / muted)
 * rather than raw colours, so the whole panel themes from one place and dark
 * mode needs no per-component work.
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertTriangle, Check, ChevronDown, Info, Loader2, X, XCircle } from "lucide-react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useRef, useState } from "react";

export function cn(...values: unknown[]): string {
  return twMerge(clsx(values));
}

/* ------------------------------------------------------------------ Button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "subtle";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  block?: boolean;
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent shadow-sm hover:bg-accent-hover active:translate-y-px disabled:bg-line-strong disabled:text-muted disabled:shadow-none",
  secondary:
    "bg-surface text-content ring-1 ring-inset ring-line-soft hover:bg-surface-hover hover:ring-line-strong disabled:text-muted",
  subtle: "bg-canvas-subtle text-content-soft hover:bg-surface-hover hover:text-content disabled:text-muted",
  ghost: "bg-transparent text-content-soft hover:bg-surface-hover hover:text-content disabled:text-muted",
  danger: "bg-bad text-white shadow-sm hover:brightness-110 active:translate-y-px disabled:bg-line-strong",
};

const BUTTON_SIZES = {
  sm: "h-8 gap-1.5 rounded-[var(--radius-field)] px-2.5 text-xs",
  md: "h-9 gap-2 rounded-[var(--radius-field)] px-3.5 text-sm",
  lg: "h-11 gap-2 rounded-[var(--radius-field)] px-5 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  block,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium transition-all duration-150 disabled:cursor-not-allowed",
        BUTTON_SIZES[size],
        BUTTON_VARIANTS[variant],
        block && "w-full",
        className,
      )}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------- Card */

export function Card({
  className,
  children,
  padded = true,
}: {
  className?: string;
  children: ReactNode;
  padded?: boolean;
}) {
  return <div className={cn("admin-card", padded && "p-5", className)}>{children}</div>;
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-content">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------- Badge */

type Tone = "ok" | "warn" | "danger" | "info" | "neutral" | "accent";

const TONE_STYLES: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  danger: "bg-bad-soft text-bad",
  info: "bg-info-soft text-info",
  accent: "bg-accent-soft text-accent",
  neutral: "bg-canvas-subtle text-content-soft",
};

export function Badge({
  tone = "neutral",
  children,
  dot,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_STYLES[tone],
      )}
    >
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden /> : null}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Avatar */

export function Avatar({ name, size = 32, src }: { name: string; size?: number; src?: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover ring-1 ring-line-soft"
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent"
      aria-hidden
    >
      {initials || "?"}
    </span>
  );
}

/* ------------------------------------------------------------------ Inputs */

export function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-medium text-content-soft">
      {children}
      {required ? (
        <span className="ml-1 text-accent" aria-hidden>
          *
        </span>
      ) : null}
    </label>
  );
}

const CONTROL =
  "block w-full rounded-[var(--radius-field)] border-0 bg-surface px-3 py-2 text-sm text-content ring-1 ring-inset ring-line-soft transition-shadow placeholder:text-muted focus:ring-2 focus:ring-inset focus:ring-accent disabled:bg-canvas-subtle disabled:text-muted";

export function Input({
  className,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, "h-9", invalid && "ring-bad focus:ring-bad", className)}
    />
  );
}

export function Textarea({
  className,
  invalid,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(CONTROL, "min-h-24 resize-y", invalid && "ring-bad focus:ring-bad", className)}
    />
  );
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        {...props}
        aria-invalid={invalid || undefined}
        className={cn(
          CONTROL,
          "h-9 cursor-pointer appearance-none pr-8",
          invalid && "ring-bad focus:ring-bad",
          className,
        )}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}

/** A password field with a show/hide control. */
export function PasswordInput({
  className,
  invalid,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className={cn(CONTROL, "h-9 pr-10", invalid && "ring-bad focus:ring-bad", className)}
      />
      <button
        type="button"
        onClick={() => setVisible((open) => !open)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-content"
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
      <path d="M9.4 5.2A9.5 9.5 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.2 6.2A17 17 0 0 0 2 12s3.6 7 10 7a9.6 9.6 0 0 0 3.3-.6" />
    </svg>
  );
}

export function FieldHelp({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs text-muted">{children}</p>;
}

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-1 flex items-start gap-1 text-xs font-medium text-bad">
      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

/** Live character counter that turns amber past the limit (PRD §4.5). */
export function CharCount({ value, max }: { value: string; max: number }) {
  const length = value.length;
  const over = length > max;
  return (
    <span className={cn("text-xs tabular-nums", over ? "font-semibold text-warn" : "text-muted")}>
      {length}/{max}
      {over ? " — Google will truncate this" : ""}
    </span>
  );
}

/* ------------------------------------------------------------------ Switch */

export function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      /* Same string as the tooltip: in the data table the switch sits in the
         Actions group with no column heading above it, so hovering has to be
         able to say what it does. */
      title={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-ok" : "bg-line-strong",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-[1.125rem]" : "translate-x-[0.1875rem]",
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ Notice */

export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "danger" | "ok";
  title?: string;
  children: ReactNode;
}) {
  const icons = {
    info: <Info className="h-4 w-4" aria-hidden />,
    warn: <AlertTriangle className="h-4 w-4" aria-hidden />,
    danger: <XCircle className="h-4 w-4" aria-hidden />,
    ok: <Check className="h-4 w-4" aria-hidden />,
  };
  const styles = {
    info: "bg-info-soft text-info",
    warn: "bg-warn-soft text-warn",
    danger: "bg-bad-soft text-bad",
    ok: "bg-ok-soft text-ok",
  };

  return (
    <div className={cn("flex gap-2.5 rounded-[var(--radius-card)] p-3 text-sm", styles[tone])} role="status">
      <span className="mt-0.5 shrink-0">{icons[tone]}</span>
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn(title && "mt-0.5", "text-content-soft")}>{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Modal */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    // Stop the page behind from scrolling while the dialog is up.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative w-full rounded-[var(--radius-card)] bg-elevated shadow-[var(--a-shadow-pop)]",
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line-soft px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-content">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted transition-colors hover:bg-surface-hover hover:text-content"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="admin-scroll max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-2 border-t border-line-soft px-5 py-3">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Dropdown */

export function Dropdown({
  trigger,
  children,
  align = "right",
}: {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="rounded-[var(--radius-field)]"
      >
        {trigger}
      </button>
      {open ? (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute z-50 mt-1.5 min-w-52 overflow-hidden rounded-[var(--radius-card)] border border-line-soft bg-elevated py-1 shadow-[var(--a-shadow-pop)]",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({
  onClick,
  icon,
  children,
  tone = "default",
}: {
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-hover",
        tone === "danger" ? "text-bad" : "text-content-soft hover:text-content",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function MenuDivider() {
  return <div className="my-1 h-px bg-line-soft" aria-hidden />;
}

/* -------------------------------------------------------------------- Tabs */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: ReactNode; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-0.5 border-b border-line-soft" role="tablist">
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              selected ? "border-accent text-accent" : "border-transparent text-muted hover:text-content",
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 ? (
              <span className="rounded-[var(--radius-pill)] bg-canvas-subtle px-1.5 text-xs tabular-nums">
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ States */

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      <span>{label}…</span>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-canvas-subtle", className)} aria-hidden />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      {icon ? (
        <span className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-canvas-subtle text-muted">
          {icon}
        </span>
      ) : null}
      <p className="text-sm font-semibold text-content">{title}</p>
      {description ? <p className="max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bad-soft text-bad">
        <XCircle className="h-5 w-5" aria-hidden />
      </span>
      <p className="max-w-md text-sm text-content-soft">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function Stars({ value }: { value: unknown }) {
  const rating = Number(value);
  if (!Number.isFinite(rating) || rating <= 0) return <span className="text-muted">—</span>;
  return (
    <span className="whitespace-nowrap text-warn" aria-label={`${rating} out of 5`}>
      {"★".repeat(Math.round(rating))}
      <span className="text-line-strong">{"★".repeat(5 - Math.round(rating))}</span>
    </span>
  );
}
