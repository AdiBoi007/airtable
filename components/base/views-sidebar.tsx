"use client"

import { Plus, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { View } from "@/lib/mock-data"
import { useState } from "react"

interface ViewsSidebarProps {
  views: View[]
  activeViewId: string
  onViewChange: (viewId: string) => void
  onCreateView: () => void
}

function GridViewIcon({ className, active }: { className?: string; active?: boolean }) {
  return (
    <svg className={cn(className, active ? "text-blue-600" : "text-gray-400")} viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="0.5" />
      <rect x="9" y="1" width="6" height="6" rx="0.5" />
      <rect x="1" y="9" width="6" height="6" rx="0.5" />
      <rect x="9" y="9" width="6" height="6" rx="0.5" />
    </svg>
  )
}

export function ViewsSidebar({ views, activeViewId, onViewChange, onCreateView }: ViewsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredViews = views.filter((view) => view.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="w-64 border-r border-gray-200 bg-white flex flex-col">
      {/* Create new */}
      <button
        onClick={onCreateView}
        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
      >
        <Plus className="h-4 w-4" />
        Create new...
      </button>

      {/* Search */}
      <div className="px-3 py-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Find a view"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
          <Settings className="h-4 w-4" />
        </button>
      </div>

      {/* Views list */}
      <div className="flex-1 overflow-auto px-2 py-1">
        {filteredViews.map((view) => {
          const isActive = activeViewId === view.id
          return (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md",
                isActive ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50",
              )}
            >
              <GridViewIcon className="h-4 w-4" active={isActive} />
              {view.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
