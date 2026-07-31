"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useApp } from "@/lib/admin/app-context";
import { RecordForm } from "@/components/admin/record-form";
import { ErrorState, Spinner } from "@/components/admin/ui";

export default function CreateRecordPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleKey } = use(params);
  const { moduleByKey, loading } = useApp();
  const module = moduleByKey(moduleKey);

  if (loading) return <Spinner />;
  if (!module) return <ErrorState message={`No module called "${moduleKey}".`} />;
  if (!module.canWrite) {
    return <ErrorState message={`Your role cannot create ${module.label.toLowerCase()}.`} />;
  }

  return (
    <div>
      <Link
        href={`/admin/m/${module.key}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-content"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        {module.label}
      </Link>

      <h1 className="mb-5 text-xl font-semibold text-content">
        New {module.singular.toLowerCase()}
      </h1>

      <RecordForm module={module} returnHref={`/admin/m/${module.key}`} />
    </div>
  );
}
