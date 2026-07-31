/**
 * Sign-in layout — a split screen.
 *
 * Left: the form, on a clean surface, so nothing competes with it.
 * Right: a dark brand panel using the same red gradient and metallic sheen as
 * the marketing site, so the panel reads as unmistakably Sumago from the first
 * screen. It collapses away below `lg`, where the form takes the full width.
 */
import { ShieldCheck } from "lucide-react";
import { SumagoWordmark } from "@/components/admin/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Form column */}
      <div className="flex flex-col bg-surface px-6 py-8 sm:px-10">
        <SumagoWordmark />

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[22rem]">{children}</div>
        </div>

        <p className="text-center text-xs text-muted">
          © {year} Sumago Infotech Pvt. Ltd. · Strive With Technology…!
        </p>
      </div>

      {/* Brand column */}
      <div className="relative hidden overflow-hidden bg-[#101013] lg:block">
        {/* Layered brand glows — the same palette the site uses for its hero. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 45% at 78% 12%, rgba(215,52,56,0.38), transparent 62%)," +
              "radial-gradient(52% 40% at 18% 88%, rgba(143,20,24,0.42), transparent 64%)," +
              "linear-gradient(140deg, #16161a 0%, #101013 55%, #1c0e10 100%)",
          }}
        />

        {/* A faint grid, to give the surface some engineering texture. */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px)," +
              "linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(80% 80% at 50% 40%, #000 30%, transparent 100%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[#ff5a5d]" aria-hidden />
            Admin panel
          </span>

          <h2 className="max-w-md text-[2rem] font-bold leading-[1.15] tracking-tight">
            Every word, image and enquiry on{" "}
            <span className="bg-[linear-gradient(120deg,#ff8f91_0%,#ff5a5d_50%,#d73438_100%)] bg-clip-text text-transparent">
              sumagoinfotech.com
            </span>{" "}
            — in one place.
          </h2>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            Publish content, post roles, and answer every lead without waiting on a
            developer. Nothing is ever deleted outright, and every change is
            attributed.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-white/50">
            {[
              ["13+", "Years"],
              ["700+", "Projects delivered"],
              ["70+", "Team members"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
