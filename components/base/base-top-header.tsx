"use client"

import { ChevronDown, Play, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { BaseCubeIcon } from "@/components/icons/airtable-logo"

interface BaseTopHeaderProps {
  baseName: string
  activeTab: string
  onTabChange: (tab: string) => void
  onBaseNameChange?: (name: string) => void
}

const tabs = ["Data", "Automations", "Interfaces", "Forms"]

export function BaseTopHeader({ baseName, activeTab, onTabChange }: BaseTopHeaderProps) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      {/* Left - Base name */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-amber-800 rounded-lg flex items-center justify-center">
          <BaseCubeIcon className="w-5 h-5 text-white" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 text-lg font-semibold text-gray-900 hover:bg-gray-100 px-2 py-1 rounded">
              {baseName}
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Rename base</DropdownMenuItem>
            <DropdownMenuItem>Duplicate base</DropdownMenuItem>
            <DropdownMenuItem>Delete base</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center - Tabs */}
      <nav className="flex items-center gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "px-4 py-2 text-sm font-medium relative",
              activeTab === tab ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />}
          </button>
        ))}
      </nav>

      {/* Right - Actions */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
          <History className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">Trial: 13 days left</span>
        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
          <Play className="h-3 w-3" />
          Launch
        </Button>
        <Button size="sm" className="bg-amber-700 hover:bg-amber-800 text-white">
          Share
        </Button>
      </div>
    </header>
  )
}
