/**
 * Types mirroring the server's module registry.
 *
 * The schema itself is fetched at runtime from `GET /api/schema` — these types
 * describe its shape so the renderer is type-safe without duplicating the
 * registry's contents.
 */

export type FieldType =
  | "text"
  | "longtext"
  | "richtext"
  | "slug"
  | "select"
  | "multiselect"
  | "listOfText"
  | "listOfObjects"
  | "image"
  | "file"
  | "reference"
  | "referenceList"
  | "boolean"
  | "number"
  | "date"
  | "datetime"
  | "email"
  | "phone"
  | "url"
  | "color"
  | "password"
  | "permissions";

/** Roles are rows in the database, not a fixed union. */
export interface ModulePermission {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export type PermissionMap = Record<string, Partial<ModulePermission>>;

export interface RoleRecord {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  permissions: PermissionMap;
  isAdmin: boolean;
  isSystem: boolean;
  userCount?: number;
  moduleCount?: number | null;
}

/** One row of the Roles screen's checkbox matrix. */
export interface PermissionCatalogueEntry {
  key: string;
  label: string;
  group: "content" | "hr" | "sales" | "platform";
  prdModule: number;
  supportsWrite: boolean;
  supportsDelete: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  max?: number;
  min?: number;
  minItems?: number;
  maxItems?: number;
  options?: SelectOption[];
  optionsSource?: string;
  ref?: string;
  fields?: FieldDef[];
  help?: string;
  warn?: string;
  unique?: boolean;
  defaultValue?: unknown;
  section?: "main" | "seo";
  aspect?: string;
  readOnly?: boolean;
  hidden?: boolean;
}

export interface ColumnDef {
  name: string;
  label: string;
  render?:
    | "text"
    | "badge"
    | "boolean"
    | "date"
    | "datetime"
    | "image"
    | "number"
    | "stars"
    | "count"
    | "link"
    | "reference"
    | "status";
  sortable?: boolean;
  width?: string;
}

export interface FilterDef {
  name: string;
  label: string;
  kind: "select" | "boolean" | "reference" | "dateRange";
  options?: SelectOption[];
  optionsSource?: string;
  ref?: string;
}

export interface ModuleSchema {
  key: string;
  table: string;
  label: string;
  singular: string;
  group: "content" | "hr" | "sales" | "platform";
  icon: string;
  prdModule: number;
  description?: string;
  singleton?: boolean;
  hasStatus?: boolean;
  hasOrder?: boolean;
  /** Carries the Active on/off switch (must also be published to go live). */
  hasActive?: boolean;
  hasSeo?: boolean;
  publicPage?: boolean;
  identity: string;
  columns: ColumnDef[];
  filters: FilterDef[];
  search: string[];
  dateField: string;
  fields: FieldDef[];
  readRoles: string[];
  writeRoles: string[];
  noDelete?: boolean;
  archivable?: boolean;
  noDuplicate?: boolean;
  maxFeatured?: number;
  publishRequires?: string;
  expectedRecords?: number;
  /** Resolved server-side for the caller's role. */
  endpoint: string;
  canWrite: boolean;
  canDelete: boolean;
}

export interface SchemaResponse {
  modules: ModuleSchema[];
  statuses: {
    applications: string[];
    enquiries: string[];
  };
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  /** Role slug — for display only; never branch on it for access. */
  role: string;
  roleName: string;
  /** The only access flag the UI should test. */
  isAdmin: boolean;
  permissions: PermissionMap;
}

export type RecordValue = Record<string, unknown>;
