"use client"

import { AirtableLogoWhite } from "@/components/icons/airtable-logo"

interface BaseCardProps {
  name: string
  icon: string
  color: string // Changed from iconBg to color string
  openedAt: string
  onClick?: () => void
}

export function BaseCard({ name, icon, color, openedAt, onClick }: BaseCardProps) {
  const isTextIcon = icon.length <= 2 && !icon.includes("◇")

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all w-full max-w-sm text-left"
    >
      <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: color }}>
        {isTextIcon ? (
          <span className="text-white font-semibold text-lg">{icon}</span>
        ) : icon === "◇" ? (
          // Special diamond icon for Incident Management
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-700"
          >
            <path d="M12 2L2 12l10 10 10-10L12 2z" />
          </svg>
        ) : (
          <AirtableLogoWhite className="w-7 h-7" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{openedAt}</p>
      </div>
    </button>
  )
}
