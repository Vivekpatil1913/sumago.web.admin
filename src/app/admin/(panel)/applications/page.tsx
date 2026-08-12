"use client";

/**
 * Module 19 — the résumé inbox now lives on the Jobs screen, as a tab beside
 * the roles the applications were sent for. This route stays so older links,
 * bookmarks and the Back link on an application still land somewhere; it only
 * forwards. The list itself is `components/admin/applications-table`.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/admin/ui";

export default function ApplicationsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/jobs?tab=applications");
  }, [router]);

  return <Spinner label="Opening Applications" />;
}
