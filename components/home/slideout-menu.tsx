"use client"

import { X, Home, Star, Share2, Users, Plus, ChevronRight, BookOpen, Globe, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SlideoutMenuProps {
  isOpen: boolean
  onClose: () => void
  onCreateClick: () => void
}

export function SlideoutMenu({ isOpen, onClose, onCreateClick }: SlideoutMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 z-40 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Slideout panel */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-xl transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-end p-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu items */}
        <div className="flex-1 px-3 py-2">
          {/* Home */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-900">
            <Home className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Home</span>
          </button>

          {/* Starred */}
          <div className="mt-1">
            <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-900">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Starred</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            <div className="ml-11 mr-3 mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-2">
                <Star className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-xs text-gray-500">Your starred bases, interfaces, and workspaces will appear here</p>
              </div>
            </div>
          </div>

          {/* Shared */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-900 mt-1">
            <Share2 className="h-5 w-5 text-gray-600" />
            <span className="font-medium">Shared</span>
          </button>

          {/* Workspaces */}
          <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-900 mt-1">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Workspaces</span>
            </div>
            <div className="flex items-center gap-1">
              <Plus className="h-4 w-4 text-gray-400" />
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </button>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 px-3 py-3">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm">Templates and apps</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <Globe className="h-5 w-5" />
            <span className="text-sm">Marketplace</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <Upload className="h-5 w-5" />
            <span className="text-sm">Import</span>
          </button>

          {/* Create button */}
          <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white" onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
    </>
  )
}
