"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface StartModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectOption: (option: "ai" | "manual") => void
}

export function StartModal({ isOpen, onClose, onSelectOption }: StartModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-semibold">How do you want to start?</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {/* AI Option */}
            <button
              onClick={() => onSelectOption("ai")}
              className="group flex flex-col items-start p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
            >
              <div className="w-full h-36 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg mb-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full border-2 border-pink-400 border-dashed" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="w-16 h-3 bg-green-200 rounded" />
                    <div className="w-20 h-8 bg-purple-200 rounded" />
                    <div className="w-12 h-12 bg-purple-300 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-lg">Build an app with Omni</span>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">New</span>
              </div>
              <p className="text-sm text-gray-600">Use AI to build a custom app tailored to your workflow.</p>
            </button>

            {/* Manual Option */}
            <button
              onClick={() => onSelectOption("manual")}
              className="group flex flex-col items-start p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
            >
              <div className="w-full h-36 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg mb-4 flex items-center justify-center">
                <div className="flex flex-col gap-1 w-32">
                  <div className="flex gap-1">
                    <div className="w-16 h-2 bg-gray-300 rounded" />
                    <div className="w-8 h-2 bg-blue-300 rounded" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-8 h-2 bg-gray-200 rounded" />
                    <div className="w-12 h-2 bg-gray-200 rounded" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-12 h-2 bg-gray-200 rounded" />
                    <div className="w-8 h-2 bg-gray-200 rounded" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-10 h-2 bg-gray-200 rounded" />
                    <div className="w-10 h-2 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              <span className="font-semibold text-lg mb-2">Build an app on your own</span>
              <p className="text-sm text-gray-600">Start with a blank app and build your ideal workflow.</p>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
