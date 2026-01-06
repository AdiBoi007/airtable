"use client"

import {
  Menu,
  Grid3X3,
  ChevronDown,
  EyeOff,
  Filter,
  Group,
  ArrowUpDown,
  Palette,
  List,
  Share2,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { View } from "@/lib/mock-data"

interface ViewToolbarProps {
  views: View[]
  activeViewId: string
  onViewChange: (viewId: string) => void
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function ViewToolbar({
  views,
  columns = [],
  activeViewId,
  onViewChange,
  onToggleSidebar,
  isSidebarOpen,
  onSortChange,
  currentSort,
  searchValue,
  onSearchChange,
  hiddenColumnIds = [],
  onToggleHidden
}: ViewToolbarProps & {
  columns?: any[], // Typed loosely for now or import Column
  onSortChange?: (sort: { columnId: string; direction: "asc" | "desc" } | null) => void
  currentSort?: { columnId: string; direction: "asc" | "desc" } | null
  searchValue?: string
  onSearchChange?: (value: string) => void
  hiddenColumnIds?: string[]
  onToggleHidden?: (columnId: string) => void
}) {
  const activeView = views.find((v) => v.id === activeViewId)

  return (
    <div className="h-11 border-b border-gray-200 bg-white flex items-center justify-between px-3">
      {/* Left - View selector */}
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <Menu className="h-4 w-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded">
              <Grid3X3 className="h-4 w-4 text-blue-600" />
              {activeView?.name || "Grid view"}
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {views.map((view) => (
              <DropdownMenuItem key={view.id} onClick={() => onViewChange(view.id)}>
                <Grid3X3 className="h-4 w-4 mr-2" />
                {view.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right - Tools */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className={cn("flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100", hiddenColumnIds.length > 0 ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900")}>
              <EyeOff className="h-4 w-4" />
              {hiddenColumnIds.length > 0 ? `${hiddenColumnIds.length} hidden` : "Hide fields"}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-2">
            <div className="text-sm font-medium mb-2 px-2 text-gray-500">Fields</div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {columns.map(col => (
                <button
                  key={col.id}
                  onClick={() => onToggleHidden?.(col.id)}
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
                >
                  <span className={cn("truncate", hiddenColumnIds.includes(col.id) && "text-gray-400 line-through")}>
                    {col.name}
                  </span>
                  <div className={cn("w-8 h-4 rounded-full relative transition-colors", hiddenColumnIds.includes(col.id) ? "bg-gray-200" : "bg-green-500")}>
                    <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", hiddenColumnIds.includes(col.id) ? "left-0.5" : "left-4.5")} />
                  </div>
                </button>
              ))}
              {columns.length === 0 && <div className="text-gray-400 px-2 text-xs">No fields found</div>}
            </div>
            {hiddenColumnIds.length > 0 && (
              <button
                onClick={() => hiddenColumnIds.forEach(id => onToggleHidden?.(id))}
                className="w-full text-left px-2 py-1.5 text-blue-600 hover:bg-blue-50 rounded text-sm mt-2"
              >
                Show all
              </button>
            )}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className={cn("flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100", searchValue ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900")}>
              <Filter className="h-4 w-4" />
              {searchValue ? "Filtered" : "Filter"}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-3">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">In this view</div>

              {searchValue ? (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 p-2 rounded text-sm text-blue-900">
                  <span>Where</span>
                  <span className="font-semibold bg-white px-1.5 py-0.5 rounded border border-blue-200">Any field</span>
                  <span>contains</span>
                  <span className="font-semibold bg-white px-1.5 py-0.5 rounded border border-blue-200">"{searchValue}"</span>
                  <button onClick={() => onSearchChange?.("")} className="ml-auto text-blue-400 hover:text-blue-600">×</button>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic py-2">No filters applied</div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  Tip: Use the search bar on the right to filter records.
                  <br />
                  Advanced column filtering coming in Phase 9.
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className={cn("flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100", currentSort ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900")}>
              <Group className="h-4 w-4" />
              Group
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-2">
            <div className="text-sm font-medium mb-2 px-2 text-gray-500">Group by</div>
            <div className="text-xs text-gray-400 px-2 mb-2">
              Grouping acts as a primary sort for now.
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {columns.map(col => (
                <button
                  key={col.id}
                  onClick={() => onSortChange?.({ columnId: col.id, direction: "asc" })}
                  className={cn(
                    "w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center justify-between",
                    currentSort?.columnId === col.id && "bg-blue-50 text-blue-700"
                  )}
                >
                  <span className="truncate">{col.name}</span>
                  {currentSort?.columnId === col.id && <ArrowUpDown className="h-3 w-3" />}
                </button>
              ))}
            </div>
            {currentSort && (
              <button
                onClick={() => onSortChange?.(null)}
                className="w-full text-left px-2 py-1.5 text-red-600 hover:bg-red-50 rounded text-sm mt-2"
              >
                Clear grouping/sort
              </button>
            )}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100",
                currentSort ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"
              )}
            >
              <ArrowUpDown className="h-4 w-4" />
              {currentSort ? "Sorted" : "Sort"}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-2">
            <div className="text-sm font-medium mb-2 px-2 text-gray-500">Sort by</div>
            <div className="space-y-1">
              <button
                onClick={() => onSortChange?.({ columnId: "createdAt", direction: "desc" })}
                className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
              >
                <span>Created time (Newest)</span>
                {currentSort?.columnId === "createdAt" && currentSort.direction === "desc" && <ArrowUpDown className="h-3 w-3" />}
              </button>
              <button
                onClick={() => onSortChange?.({ columnId: "createdAt", direction: "asc" })}
                className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
              >
                <span>Created time (Oldest)</span>
                {currentSort?.columnId === "createdAt" && currentSort.direction === "asc" && <ArrowUpDown className="h-3 w-3" />}
              </button>

              <div className="h-px bg-gray-200 my-1" />
              <div className="px-2 text-xs text-gray-400 mb-1">Columns</div>

              {columns.map(col => (
                <button
                  key={col.id}
                  onClick={() => onSortChange?.({ columnId: col.id, direction: "asc" })} // Default to asc, user can toggle? Simplified for now.
                  className="w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
                >
                  <span className="truncate">{col.name}</span>
                  {currentSort?.columnId === col.id && <ArrowUpDown className="h-3 w-3" />}
                </button>
              ))}

              {currentSort && (
                <button
                  onClick={() => onSortChange?.(null)}
                  className="w-full text-left px-2 py-1.5 text-red-600 hover:bg-red-50 rounded text-sm mt-2"
                >
                  Clear sort
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded">
              <Palette className="h-4 w-4" />
              Color
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="text-sm">
              <p className="font-medium mb-2">Row coloring</p>
              <p className="text-gray-500">No colors applied.</p>
            </div>
          </PopoverContent>
        </Popover>

        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <List className="h-4 w-4" />
        </button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded">
              <Share2 className="h-4 w-4" />
              Share and sync
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72">
            <div className="text-sm">
              <p className="font-medium mb-2">Share this view</p>
              <p className="text-gray-500">Create a shared link or sync with external services.</p>
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative flex items-center">
          <Search className="absolute left-2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Find..."
            className="h-7 w-40 pl-8 pr-2 text-sm bg-transparent hover:bg-gray-100 focus:bg-white border-transparent focus:border-blue-500 border rounded transition-all outline-none"
          />
        </div>
      </div>
    </div>
  )
}
