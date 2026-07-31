"use client";

import { use } from "react";
import { RoleEditor } from "@/components/admin/role-editor";

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RoleEditor roleId={id} />;
}
