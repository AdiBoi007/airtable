"use client"

import type React from "react"

import { Server, Settings, Grid3X3 } from "lucide-react"

interface TemplateCardProps {
  icon: string
  title: string
  description: string
  onClick?: () => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  server: Server,
  settings: Settings,
  grid: Grid3X3,
}

export function TemplateCard({ icon, title, description, onClick }: TemplateCardProps) {
  const IconComponent = iconMap[icon] || Server

  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all text-left"
    >
      <div className="w-8 h-8 flex items-center justify-center rounded text-gray-600">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-0.5">{description}</p>
      </div>
    </button>
  )
}
