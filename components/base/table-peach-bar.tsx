"use client"

import { ChevronDown, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Table } from "@/lib/mock-data"

interface TablePeachBarProps {
  tables: Table[]
  activeTableId: string
  onTableChange: (tableId: string) => void
  onAddTable: () => void
}

export function TablePeachBar({ tables, activeTableId, onTableChange, onAddTable }: TablePeachBarProps) {
  const activeTable = tables.find((t) => t.id === activeTableId)

  return (
    <div className="h-11 bg-orange-50 border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left - Table selector */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:bg-orange-100 px-2 py-1 rounded">
              {activeTable?.name || "Table 1"}
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {tables.map((table) => (
              <DropdownMenuItem key={table.id} onClick={() => onTableChange(table.id)}>
                {table.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ChevronDown className="h-3 w-3 text-gray-400" />

        <button
          onClick={onAddTable}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-orange-100 px-2 py-1 rounded"
        >
          <Plus className="h-3 w-3" />
          Add or import
        </button>
      </div>

      {/* Right - Tools */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-orange-100 px-2 py-1 rounded">
            Tools
            <ChevronDown className="h-3 w-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Extensions</DropdownMenuItem>
          <DropdownMenuItem>Automations</DropdownMenuItem>
          <DropdownMenuItem>Apps</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
