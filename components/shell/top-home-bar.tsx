"use client"

import {
  Search,
  HelpCircle,
  Bell,
  Menu,
  User,
  Users,
  BellIcon,
  Languages,
  Palette,
  Mail,
  Globe,
  Link,
  Wrench,
  Trash2,
  LogOut,
  ChevronRight,
} from "lucide-react"

import { AirtableLogo, AirtableWordmark } from "@/components/icons/airtable-logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopHomeBarProps {
  onMenuClick: () => void
}

export function TopHomeBar({ onMenuClick }: TopHomeBarProps) {

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-100" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-1">
          <AirtableLogo className="h-7 w-7" />
          <AirtableWordmark className="text-lg font-semibold text-gray-900" />
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-12 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            ⌘ K
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:bg-gray-100">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
          <Bell className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 ml-2 p-0 rounded-full">
              <Avatar className="h-8 w-8 bg-green-600 cursor-pointer">
                <AvatarFallback className="bg-green-600 text-white text-sm font-medium">
                  D
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 p-0">
            {/* User info header */}
            <div className="px-4 py-3">
              <p className="font-medium text-gray-900">Demo User</p>
              <p className="text-sm text-gray-500">demo@example.com</p>
            </div>
            <DropdownMenuSeparator className="my-0" />

            {/* Account section */}
            <div className="py-1">
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <User className="h-4 w-4 mr-3 text-gray-500" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Users className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Manage groups</span>
                <span className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                  Business
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <BellIcon className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Notification preferences</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Languages className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Language preferences</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Palette className="h-4 w-4 mr-3 text-gray-500" />
                <span className="flex-1">Appearance</span>
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Beta
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-0" />

            {/* Business actions */}
            <div className="py-1">
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Mail className="h-4 w-4 mr-3 text-gray-500" />
                <span>Contact sales</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Globe className="h-4 w-4 mr-3 text-gray-500" />
                <span>Upgrade</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Mail className="h-4 w-4 mr-3 text-gray-500" />
                <span>Tell a friend</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-0" />

            {/* Developer tools */}
            <div className="py-1">
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Link className="h-4 w-4 mr-3 text-gray-500" />
                <span>Integrations</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Wrench className="h-4 w-4 mr-3 text-gray-500" />
                <span>Builder hub</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="my-0" />

            {/* Account actions */}
            <div className="py-1">
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <Trash2 className="h-4 w-4 mr-3 text-gray-500" />
                <span>Trash</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <LogOut className="h-4 w-4 mr-3 text-gray-500" />
                <span>Log out (Demo)</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu >
      </div >
    </header >
  )
}
