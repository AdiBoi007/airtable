"use client"

import { useState } from "react"
import { Upload, Plus, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface HomeLeftRailProps {
  activeItem?: string
  onItemClick?: (item: string) => void
  onCreateClick?: () => void
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function SharedIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 14 20 9 15 4" />
      <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
    </svg>
  )
}

function WorkspacesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function TemplatesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function MarketplaceIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

const railItems = [
  { id: "home", icon: HomeIcon, label: "Home" },
  { id: "starred", icon: StarIcon, label: "Starred", hasDropdown: true },
  { id: "shared", icon: SharedIcon, label: "Shared" },
  { id: "workspaces", icon: WorkspacesIcon, label: "Workspaces", hasActions: true },
]

const bottomItems = [
  { id: "templates", icon: TemplatesIcon, label: "Templates and apps" },
  { id: "marketplace", icon: MarketplaceIcon, label: "Marketplace" },
  { id: "import", icon: Upload, label: "Import" },
]

export function HomeLeftRail({
  activeItem = "home",
  onItemClick,
  onCreateClick,
  isExpanded: controlledExpanded,
  onExpandedChange,
}: HomeLeftRailProps) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const [starredOpen, setStarredOpen] = useState(false)

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded

  const handleMouseEnter = () => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(true)
    } else if (onExpandedChange) {
      onExpandedChange(true)
    }
  }

  const handleMouseLeave = () => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(false)
    }
    // Don't collapse on mouse leave if controlled - let the hamburger toggle it
  }

  return (
    <div
      className={cn(
        "border-r border-gray-200 bg-white flex flex-col py-4 transition-all duration-200",
        isExpanded ? "w-64" : "w-14",
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main nav items */}
      <div className="flex flex-col px-2">
        {railItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                onItemClick?.(item.id)
                if (item.hasDropdown) {
                  setStarredOpen(!starredOpen)
                }
              }}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg transition-colors",
                isExpanded ? "px-3 py-2.5" : "justify-center py-2.5",
                activeItem === item.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {isExpanded && (
                <>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className={cn("h-4 w-4 transition-transform", starredOpen && "rotate-180")} />
                  )}
                  {item.hasActions && (
                    <div className="flex items-center gap-1">
                      <Plus className="h-4 w-4 text-gray-400" />
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </>
              )}
            </button>

            {/* Starred dropdown content */}
            {item.id === "starred" && isExpanded && starredOpen && (
              <div className="ml-8 mr-2 mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-2">
                  <StarIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-500">
                    Your starred bases, interfaces, and workspaces will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Separator */}
      <div className="mx-3 mb-2 border-t border-gray-200" />

      {/* Bottom items */}
      <div className="flex flex-col px-2">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors",
              isExpanded ? "px-3 py-2" : "justify-center py-2",
            )}
            title={!isExpanded ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isExpanded && <span className="text-sm">{item.label}</span>}
          </button>
        ))}

        {/* Create button */}
        {isExpanded ? (
          <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        ) : (
          <button
            onClick={onCreateClick}
            className="w-full flex justify-center py-2 mt-1 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
            title="Create"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}
