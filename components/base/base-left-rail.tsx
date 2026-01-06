"use client"

import { AirtableLogoMono } from "@/components/icons/airtable-logo"
import { OmniLogo } from "@/components/icons/omni-logo"
import { Pencil, History, SlidersHorizontal, HelpCircle, Bell } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface BaseLeftRailProps {
  isOmniOpen?: boolean
  onOmniToggle?: () => void
}

export function BaseLeftRail({ isOmniOpen = false, onOmniToggle }: BaseLeftRailProps) {
  return (
    <TooltipProvider>
      <div className="group w-14 border-r border-gray-200 bg-white flex flex-col items-center py-3">
        {/* Top icons */}
        <div className="flex flex-col items-center gap-1">
          {/* Always visible: Home icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <AirtableLogoMono className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOmniToggle}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                  isOmniOpen ? "bg-orange-100" : "hover:bg-gray-100"
                }`}
              >
                <OmniLogo className="scale-[0.35]" color="bg-[#C75C2E]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Open Omni</p>
            </TooltipContent>
          </Tooltip>

          {/* Hidden icons that appear on hover */}
          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                  <Pencil className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Design</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                  <History className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>History</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom icons - hidden by default */}
        <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                <HelpCircle className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Help</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>

          <Avatar className="h-8 w-8 mt-1 bg-green-600">
            <AvatarFallback className="bg-green-600 text-white text-sm font-medium">S</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </TooltipProvider>
  )
}
