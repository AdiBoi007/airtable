// Mock data for the Airtable clone UI

export interface Base {
  id: string
  name: string
  icon: string
  color: string // Changed from iconBg to color string for flexibility
  openedAt: Date
}

export interface Table {
  id: string
  baseId: string
  name: string
}

export interface Column {
  id: string
  name: string
  type: "text" | "number" | "user" | "status" | "attachment"
  icon: string
  width: number
}

export interface Row {
  id: string
  rowNumber: number
  data: Record<string, string>
}

export interface View {
  id: string
  name: string
  type: "grid" | "kanban" | "calendar"
}

export const baseColors = [
  "#0d7377", // teal
  "#2d7ff9", // blue
  "#8b4513", // brown
  "#6b7280", // gray
  "#b45309", // amber/orange
  "#059669", // emerald
  "#7c3aed", // violet
  "#dc2626", // red
  "#0891b2", // cyan
  "#65a30d", // lime
]

export function getRandomBaseColor(): string {
  return baseColors[Math.floor(Math.random() * baseColors.length)]
}

export const mockBases: Base[] = [
  {
    id: "base-1",
    name: "Untitled Base",
    icon: "Un",
    color: "#0d7377", // teal
    openedAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
  },
  {
    id: "base-2",
    name: "Untitled Base",
    icon: "Un",
    color: "#2d7ff9", // blue
    openedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: "base-3",
    name: "Untitled Base",
    icon: "Un",
    color: "#8b4513", // brown
    openedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "base-4",
    name: "Incident Management",
    icon: "◇",
    color: "#f5d0c5", // peach/amber light
    openedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
  },
]

export const mockTables: Table[] = [
  { id: "table-1", baseId: "base-1", name: "Table 1" },
  { id: "table-2", baseId: "base-1", name: "Table 2" },
  { id: "table-3", baseId: "base-1", name: "Table 3" },
]

export const mockColumns: Column[] = [
  { id: "col-1", name: "Name", type: "text", icon: "A", width: 200 },
  { id: "col-2", name: "Notes", type: "text", icon: "≡", width: 150 },
  { id: "col-3", name: "Assignee", type: "user", icon: "👤", width: 120 },
  { id: "col-4", name: "Status", type: "status", icon: "○", width: 100 },
  { id: "col-5", name: "Attachments", type: "attachment", icon: "📎", width: 120 },
  { id: "col-6", name: "Attachment...", type: "attachment", icon: "📎", width: 140 },
]

export const mockRows: Row[] = [
  { id: "row-1", rowNumber: 1, data: {} },
  { id: "row-2", rowNumber: 2, data: {} },
  { id: "row-3", rowNumber: 3, data: {} },
]

export const mockViews: View[] = [{ id: "view-1", name: "Grid view", type: "grid" }]

export const templateCards = [
  {
    id: "1",
    icon: "server",
    title: "Asset Inventory",
    description: "Track servers, software, and licenses in one place.",
  },
  {
    id: "2",
    icon: "settings",
    title: "Change Management",
    description: "Manage and approve infrastructure changes with audit trails.",
  },
  {
    id: "3",
    icon: "grid",
    title: "Incident Tracker",
    description: "Log, prioritize, and resolve IT incidents efficiently.",
  },
]

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return "Opened just now"
  if (diffMinutes < 60) return `Opened ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`
  if (diffHours < 24) return `Opened ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  if (diffDays === 1) return "Opened yesterday"
  return `Opened ${diffDays} days ago`
}
