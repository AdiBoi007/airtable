"use client"

import { useState } from "react"
import { Star, MoreHorizontal } from "lucide-react"
import { AirtableLogoWhite } from "@/components/icons/airtable-logo"

interface BaseListRowProps {
  name: string
  icon: string
  color: string
  openedAt: string
  workspace?: string
  onClick?: () => void
}

export function BaseListRow({
  name,
  icon,
  color,
  openedAt,
  workspace = "My First Workspace",
  onClick,
}: BaseListRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isTextIcon = icon.length <= 2 && !icon.includes("◇")

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-left group"
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        {isTextIcon ? (
          <span className="text-white font-semibold text-xs">{icon}</span>
        ) : icon === "◇" ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-700"
          >
            <path d="M12 2L2 12l10 10 10-10L12 2z" />
          </svg>
        ) : (
          <AirtableLogoWhite className="w-4 h-4" />
        )}
      </div>

      {/* Name column */}
      <div className="flex items-center gap-3 ml-3 flex-1 min-w-0">
        <span className="font-medium text-gray-900 truncate">{name}</span>
        {isHovered && (
          <>
            <span className="text-sm text-gray-500 flex-shrink-0">Open data</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Star action
              }}
              className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
            >
              <Star className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // More actions
              }}
              className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </>
        )}
      </div>

      {/* Last opened column */}
      <div className="w-48 text-sm text-gray-500 flex-shrink-0">{openedAt}</div>

      {/* Workspace column */}
      <div className="w-48 text-sm text-gray-500 flex-shrink-0 text-right">{workspace}</div>
    </button>
  )
}
