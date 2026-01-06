"use client"

import { Plus, Wand2, Database, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GridFooterProps {
  recordCount: number
  onAddRow: () => void
  onAddOption: (option: "1" | "50" | "1000" | "10000" | "100000" | "clear") => void
}

export function GridFooter({ recordCount, onAddRow, onAddOption }: GridFooterProps) {
  // Check for dev environment
  const showDevTools = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DEV_TOOLS === "1"

  return (
    <div className="h-10 border-t border-gray-200 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-7 gap-1 bg-transparent" onClick={onAddRow}>
          <Plus className="h-3 w-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1 bg-transparent">
              <Wand2 className="h-3 w-3" />
              Add...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => onAddOption("1")}>
              <Plus className="mr-2 h-4 w-4" /> Add 1 row
            </DropdownMenuItem>

            {showDevTools && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs text-gray-400 font-medium">Demo Data</div>
                <DropdownMenuItem onClick={() => onAddOption("50")}>
                  <Database className="mr-2 h-4 w-4" /> Seed 50 rows
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddOption("1000")}>
                  <Database className="mr-2 h-4 w-4" /> Add 1,000 rows
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddOption("10000")}>
                  <Database className="mr-2 h-4 w-4" /> Add 10,000 rows
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddOption("100000")}>
                  <Database className="mr-2 h-4 w-4" /> Add 100,000 rows
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onAddOption("clear")} className="text-red-600 focus:text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Reset table (Delete all)
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <span className="text-sm text-gray-500">{recordCount} records</span>
    </div>
  )
}
