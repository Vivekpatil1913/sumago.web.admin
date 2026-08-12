import Link from "next/link";
import { ArrowRight, MapPin, Clock, Briefcase } from "lucide-react";
import type { JobRecord } from "@/lib/cms/types";

/**
 * A compact open-position card — title, a short hook, a tight meta line
 * (location · type · experience) and the team below it. Sized to sit in a grid
 * of small cards. The whole card links to the role's detail page, where
 * candidates read the full spec and apply.
 */
export function JobCard({ position }: { position: JobRecord }) {
  const { slug, title, department, location, type, experience, summary } = position;

  return (
    <Link
      href={`/careers/${slug}`}
      aria-label={`View ${title} role`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_24px_48px_-24px_rgba(215,52,56,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {/* top sheen line on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-ink md:text-xl">
        {title}
      </h3>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/65">
        {summary}
      </p>

      {/* meta line */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-ink/70">
        <li className="inline-flex items-center gap-1.5">
          <MapPin size={13} className="text-brand" aria-hidden />
          {location}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Briefcase size={13} className="text-brand" aria-hidden />
          {type}
        </li>
        <li className="inline-flex items-center gap-1.5">
          <Clock size={13} className="text-brand" aria-hidden />
          {experience}
        </li>
      </ul>

      {/* category — after the experience */}
      <span className="chip mt-4 w-fit self-start !py-1 !px-2.5 text-xs text-brand-ink">
        {department}
      </span>

      <span className="mt-4 inline-flex items-center gap-1 border-t border-line pt-3 text-sm font-semibold text-brand-ink">
        View role
        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
