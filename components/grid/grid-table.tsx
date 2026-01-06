"use client"

import React, { useState, useCallback, useRef, useEffect, memo } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Plus, Type, AlignLeft, User, Circle, Paperclip, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Column, Row } from "@/lib/mock-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GridTableProps {
  columns: Column[]
  rows: Row[]
  onCellChange: (rowId: string, columnId: string, value: string) => void
  onAddRow: () => void
  onAddColumn: (name: string, type: "text" | "number") => void
  onFetchNextPage?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
}

const columnIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  text: Type,
  number: AlignLeft,
  user: User,
  status: Circle,
  attachment: Paperclip,
}

const GridTableInner = ({
  columns,
  rows,
  onCellChange,
  onAddRow,
  onAddColumn,
  onFetchNextPage,
  hasNextPage,
  isFetchingNextPage
}: GridTableProps) => {
  const [selectedCell, setSelectedCell] = useState<{ rowId: string; colId: string } | null>(null)
  const [editingCell, setEditingCell] = useState<{ rowId: string; colId: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false)
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnType, setNewColumnType] = useState<"text" | "number">("text")
  const inputRef = useRef<HTMLInputElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)

  // Virtualizer key generator
  const getItemKey = useCallback((index: number) => {
    // If index is valid row, use ID. Else (loader) use index.
    return rows[index]?.id ?? `idx-${index}`
  }, [rows])

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32, // Fixed height 32px
    overscan: 5,
    getItemKey,
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  // Infinite Scroll Trigger
  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse()
    if (!lastItem) return

    const shouldFetch = lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage

    if (shouldFetch) {
      console.log("Triggering fetchNextPage...", { lastIndex: lastItem.index, totalRows: rows.length })
      // Fix flushSync error: Break call stack
      setTimeout(() => {
        onFetchNextPage?.()
      }, 0)
    }
  }, [hasNextPage, onFetchNextPage, isFetchingNextPage, virtualItems, rows.length])

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingCell])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ... (existing keyboard logic)
      if (!selectedCell || editingCell) return

      // Optimization: find index by ID is slow for large lists used in keynav?
      // Better to store index in selectedCell?
      // For now, keep existing logic, but note it might be linear scan.
      // 50-100 rows is fine. 10k rows is slow.
      // Phase 6 will optimize this.

      const currentRowIndex = rows.findIndex((r) => r.id === selectedCell.rowId)
      const currentColIndex = columns.findIndex((c) => c.id === selectedCell.colId)

      // ... (rest of keyboard logic same as before, copied below or elided?)
      // I must include all code if I am replacing the function body.
      // Let's copy the keyboard logic from previous file content.

      let newRowIndex = currentRowIndex
      let newColIndex = currentColIndex

      switch (e.key) {
        case "ArrowUp":
          newRowIndex = Math.max(0, currentRowIndex - 1)
          e.preventDefault()
          break
        case "ArrowDown":
          newRowIndex = Math.min(rows.length - 1, currentRowIndex + 1)
          e.preventDefault()
          break
        case "ArrowLeft":
          newColIndex = Math.max(0, currentColIndex - 1)
          e.preventDefault()
          break
        case "ArrowRight":
          newColIndex = Math.min(columns.length - 1, currentColIndex + 1)
          e.preventDefault()
          break
        case "Tab":
          if (e.shiftKey) {
            newColIndex = currentColIndex - 1
            if (newColIndex < 0) {
              newColIndex = columns.length - 1
              newRowIndex = Math.max(0, currentRowIndex - 1)
            }
          } else {
            newColIndex = currentColIndex + 1
            if (newColIndex >= columns.length) {
              newColIndex = 0
              newRowIndex = Math.min(rows.length - 1, currentRowIndex + 1)
            }
          }
          e.preventDefault()
          break
        case "Enter":
          setEditingCell(selectedCell)
          setEditValue(rows[currentRowIndex]?.data[selectedCell.colId] || "")
          e.preventDefault()
          break
        default:
          return
      }

      if (rows[newRowIndex] && columns[newColIndex]) {
        setSelectedCell({ rowId: rows[newRowIndex].id, colId: columns[newColIndex].id })

        // Scroll to make visible
        rowVirtualizer.scrollToIndex(newRowIndex)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedCell, editingCell, rows, columns, rowVirtualizer]) // Added rowVirtualizer dependency

  const handleCellClick = useCallback((rowId: string, colId: string) => {
    setSelectedCell({ rowId, colId })
  }, [])

  const handleCellDoubleClick = useCallback(
    (rowId: string, colId: string) => {
      const row = rows.find((r) => r.id === rowId)
      setEditingCell({ rowId, colId })
      setEditValue(row?.data[colId] || "")
    },
    [rows],
  )

  const handleEditBlur = useCallback(() => {
    if (editingCell) {
      onCellChange(editingCell.rowId, editingCell.colId, editValue)
      setEditingCell(null)
    }
  }, [editingCell, editValue, onCellChange])

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleEditBlur()
      } else if (e.key === "Escape") {
        setEditingCell(null)
      }
    },
    [handleEditBlur],
  )

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      onAddColumn(newColumnName.trim(), newColumnType)
      setNewColumnName("")
      setNewColumnType("text")
      setIsAddColumnOpen(false)
    }
  }

  return (
    <TooltipProvider>
      <div ref={parentRef} className="flex-1 overflow-auto bg-white relative">
        <div className="min-w-max">
          {/* Header row - Sticky */}
          <div className="flex sticky top-0 z-10 bg-white border-b border-gray-200">
            {/* Row number header */}
            <div className="w-16 min-w-16 h-8 flex items-center justify-center border-r border-gray-200 bg-gray-50">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" />
            </div>

            {/* Column headers */}
            {columns.map((col, index) => {
              const Icon = columnIcons[col.type] || Type
              const isFirstCol = index === 0
              const isRequiredCol = col.name === "Attachment..."

              return (
                <DropdownMenu key={col.id}>
                  <DropdownMenuTrigger asChild>
                    <div
                      className={cn(
                        "h-8 flex items-center gap-2 px-2 border-r border-gray-200 cursor-pointer hover:bg-gray-100",
                        isFirstCol ? "bg-cyan-50/50" : "bg-gray-50",
                      )}
                      style={{ width: col.width, minWidth: col.width }}
                    >
                      <Icon className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-700 truncate">{col.name}</span>
                      {isRequiredCol && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-gray-400 flex-shrink-0 ml-auto" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Required field</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Edit field</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate field</DropdownMenuItem>
                    <DropdownMenuItem>Insert left</DropdownMenuItem>
                    <DropdownMenuItem>Insert right</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete field</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}

            {/* Notification column header - empty */}
            <div className="w-8 min-w-8 h-8 flex items-center justify-center border-r border-gray-200 bg-gray-50" />

            {/* Add column button */}
            <button
              onClick={() => setIsAddColumnOpen(true)}
              className="w-8 min-w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100"
            >
              <Plus className="h-3.5 w-3.5 text-gray-500" />
            </button>
          </div>

          {/* Virtualizer Container */}
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
              minHeight: rows.length === 0 ? '200px' : undefined
            }}
          >
            {rows.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                No records found
              </div>
            )}
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > rows.length - 1
              const row = rows[virtualRow.index]

              if (isLoaderRow) {
                return (
                  <div key="loader"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex items-center justify-center text-sm text-gray-400"
                  >
                    Loading more...
                  </div>
                )
              }

              return (
                <div
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className="flex airtable-row hover:bg-blue-50/30"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {/* Row number */}
                  <div className="w-16 min-w-16 h-8 flex items-center justify-center border-r border-b border-gray-200 bg-white text-xs text-gray-500">
                    {row.rowNumber}
                  </div>

                  {/* Cells */}
                  {columns.map((col, index) => {
                    const isSelected = selectedCell?.rowId === row.id && selectedCell?.colId === col.id
                    const isEditing = editingCell?.rowId === row.id && editingCell?.colId === col.id
                    const isFirstCol = index === 0

                    return (
                      <div
                        key={`${row.id}-${col.id}`}
                        onClick={() => handleCellClick(row.id, col.id)}
                        onDoubleClick={() => handleCellDoubleClick(row.id, col.id)}
                        className={cn(
                          "h-8 border-r border-b border-gray-200 cursor-cell",
                          isFirstCol ? "bg-cyan-50/30" : "bg-white",
                          isSelected && !isEditing && "ring-2 ring-blue-500 ring-inset z-10",
                        )}
                        style={{ width: col.width, minWidth: col.width }}
                      >
                        {isEditing ? (
                          <input
                            ref={inputRef}
                            type={col.type === "number" ? "number" : "text"}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleEditBlur}
                            onKeyDown={handleEditKeyDown}
                            className="w-full h-full px-2 text-xs border-none outline-none bg-white"
                          />
                        ) : (
                          <div className="w-full h-full px-2 flex items-center text-xs text-gray-900 truncate">
                            {col.name === "Attachment..." && !row.data[col.id] ? (
                              <span className="text-gray-400 flex items-center gap-1">
                                Required
                              </span>
                            ) : (
                              row.data[col.id] || ""
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Notification cell */}
                  <div className="w-8 min-w-8 h-8 border-r border-b border-gray-200 bg-white" />

                  {/* Empty space after add column */}
                  <div className="w-8 min-w-8 h-8 border-b border-gray-200 bg-white" />
                </div>
              )
            })}
          </div>

          {/* Add row button row - positioned after virtual content? 
              Ideally sticky at bottom or just after list.
              If inside a virtualizer logic, it's tricky.
              For infinite scroll, "Add Row" button usually floats or is at actual end.
              Use 'height' + extra?
              Or just put it after the virtualization container. 
          */}
          <div className="flex">
            <button
              onClick={onAddRow}
              className="w-16 min-w-16 h-8 flex items-center justify-center border-r border-b border-gray-200 bg-white hover:bg-gray-50"
            >
              <Plus className="h-3.5 w-3.5 text-gray-400" />
            </button>
            <div className="flex-1 h-8 border-b border-gray-200 bg-white" />
          </div>
        </div>

        {/* Add column dialog */}
        <Dialog open={isAddColumnOpen} onOpenChange={setIsAddColumnOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new field</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="columnName">Field name</Label>
                <Input
                  id="columnName"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter field name"
                />
              </div>
              <div className="space-y-2">
                <Label>Field type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={newColumnType === "text" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewColumnType("text")}
                  >
                    Text
                  </Button>
                  <Button
                    variant={newColumnType === "number" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewColumnType("number")}
                  >
                    Number
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddColumnOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddColumn}>Add field</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}

export const GridTable = memo(GridTableInner)
