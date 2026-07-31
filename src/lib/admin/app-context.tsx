"use client";

/**
 * Session + schema context.
 *
 * The schema (all 25 modules, their fields, filters and permissions) is fetched
 * once after sign-in and shared from here, so every screen renders from the same
 * definition the server validates against.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ApiError, api } from "./api";
import type { CurrentUser, ModuleSchema, SchemaResponse, SelectOption } from "./types";

interface AppState {
  user: CurrentUser | null;
  modules: ModuleSchema[];
  loading: boolean;
  error: string | null;
  moduleByKey: (key: string) => ModuleSchema | undefined;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Cached dynamic option lists (`optionsSource`). */
  loadOptions: (source: string) => Promise<SelectOption[]>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [modules, setModules] = useState<ModuleSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Options rarely change within a session, so one fetch per source is enough.
  const optionCache = useRef(new Map<string, Promise<SelectOption[]>>());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await api.get<{ user: CurrentUser }>("/auth/me");
      setUser(me.data.user);

      const schema = await api.get<SchemaResponse>("/schema");
      setModules(schema.data.modules);
    } catch (caught) {
      if (caught instanceof ApiError && caught.isAuthError) {
        setUser(null);
        setModules([]);
        router.replace("/admin/login");
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not load the panel.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const signOut = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Already signed out server-side — clearing locally is still correct.
    }
    setUser(null);
    setModules([]);
    optionCache.current.clear();
    router.replace("/admin/login");
  }, [router]);

  const loadOptions = useCallback(async (source: string): Promise<SelectOption[]> => {
    const cached = optionCache.current.get(source);
    if (cached) return cached;

    const pending = api
      .get<SelectOption[]>(`/options/${encodeURIComponent(source)}`)
      .then((response) => response.data)
      .catch(() => {
        // A failed option list must not break the whole form.
        optionCache.current.delete(source);
        return [] as SelectOption[];
      });

    optionCache.current.set(source, pending);
    return pending;
  }, []);

  const moduleByKey = useCallback(
    (key: string) => modules.find((module) => module.key === key),
    [modules],
  );

  const value = useMemo<AppState>(
    () => ({ user, modules, loading, error, moduleByKey, refresh: load, signOut, loadOptions }),
    [user, modules, loading, error, moduleByKey, load, signOut, loadOptions],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside <AppProvider>");
  return context;
}

/* ------------------------------------------------------------------ Toasts */

interface Toast {
  id: number;
  tone: "ok" | "danger" | "warn";
  message: string;
}

interface ToastState {
  toasts: Toast[];
  notify: (message: string, tone?: Toast["tone"]) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastState | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: Toast["tone"] = "ok") => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, tone, message }]);
      // Errors stay longer — they usually need reading twice.
      window.setTimeout(() => dismiss(id), tone === "ok" ? 4000 : 8000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
        role="status"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={
              "pointer-events-auto flex items-start justify-between gap-3 rounded-md px-4 py-3 text-sm shadow-lg ring-1 ring-inset " +
              (toast.tone === "ok"
                ? "bg-white text-ink-800 ring-ok-500/30"
                : toast.tone === "warn"
                  ? "bg-warn-50 text-warn-700 ring-warn-500/30"
                  : "bg-danger-50 text-danger-700 ring-danger-500/30")
            }
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 text-xs font-medium underline underline-offset-2 opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastState {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>");
  return context;
}

/** Turn any thrown value into a message worth showing a person. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
