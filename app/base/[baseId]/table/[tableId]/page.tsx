"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { BaseLeftRail } from "@/components/base/base-left-rail"
import { BaseTopHeader } from "@/components/base/base-top-header"
import { TablePeachBar } from "@/components/base/table-peach-bar"
import { ViewToolbar } from "@/components/base/view-toolbar"
import { ViewsSidebar } from "@/components/base/views-sidebar"
import { GridTable } from "@/components/grid/grid-table"
import { GridFooter } from "@/components/grid/grid-footer"
import { OmniPanel } from "@/components/base/omni-panel"
import { mockTables, type Column, type Row } from "@/lib/mock-data"
import { api } from "@/trpc/react"

export default function BasePage() {
  const params = useParams()
  const router = useRouter()
  const baseId = params.baseId as string
  const tableId = params.tableId as string

  const [activeTab, setActiveTab] = useState("Data")
  const [activeTableId, setActiveTableId] = useState(tableId)
  const [activeViewId, setActiveViewId] = useState("view-1")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isOmniOpen, setIsOmniOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ columnId: string; direction: "asc" | "desc" } | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchValue])

  // Real Data Fetching
  const { data: tables } = api.table.listByBase.useQuery({ baseId })
  const { data: columns } = api.column.listByTable.useQuery({ tableId }, { enabled: !!tableId })
  const { data: views } = api.view.listByTable.useQuery({ tableId }, { enabled: !!tableId })

  const { data: rowPages, fetchNextPage, hasNextPage, isFetchingNextPage, error } = api.row.infiniteList.useInfiniteQuery(
    { tableId, limit: 50, sort: sortConfig, search: debouncedSearch },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  useEffect(() => {
    if (error) {
      console.error("Infinite scroll failed:", error)
      // alert("Failed to load more rows: " + error.message) // Optional
    }
  }, [error])

  const utils = api.useUtils()

  // Mutations
  const createTable = api.table.create.useMutation({
    onSuccess: () => utils.table.listByBase.invalidate({ baseId }),
    onError: (error) => {
      console.error("Failed to create table:", error)
      alert(`Failed to create table: ${error.message}`)
    }
  })
  const createColumn = api.column.create.useMutation({
    onSuccess: () => utils.column.listByTable.invalidate({ tableId })
  })
  const createRow = api.row.create.useMutation({
    onMutate: async () => {
      const queryKey = { tableId, limit: 50, sort: sortConfig, search: debouncedSearch }
      await utils.row.infiniteList.cancel(queryKey)
      const previousData = utils.row.infiniteList.getInfiniteData(queryKey)

      utils.row.infiniteList.setInfiniteData(queryKey, (old) => {
        if (!old) return old
        // Clone the pages
        const newPages = [...old.pages]
        // Get the last page
        const lastPage = newPages[newPages.length - 1]
        // Create a temp row
        const tempRow = {
          id: `temp-${Date.now()}`,
          rowNumber: -1, // Will be fixed by index mapping
          data: {},
          tableId,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any

        // Append to last page items
        const newItems = [...lastPage.items, tempRow]
        newPages[newPages.length - 1] = { ...lastPage, items: newItems }

        return { ...old, pages: newPages }
      })

      return { previousData }
    },
    onError: (err, _newRow, context) => {
      console.error("Failed to create row:", err)
      const queryKey = { tableId, limit: 50, sort: sortConfig, search: debouncedSearch }
      utils.row.infiniteList.setInfiniteData(queryKey, context?.previousData)
      alert("Failed to create row: " + err.message)
    },
    onSettled: () => {
      console.log("Row creation settled. Invalidating...")
      // Force refetch to get real ID
      utils.row.infiniteList.invalidate({ tableId, sort: sortConfig, search: debouncedSearch })
    }
  })
  const updateCell = api.row.updateCell.useMutation({
    onMutate: async (newRow) => {
      // Correct Query Key including search
      const queryKey = { tableId, limit: 50, sort: sortConfig, search: debouncedSearch }

      // Cancel outgoing refetches
      await utils.row.infiniteList.cancel(queryKey)

      // Snapshot previous value
      const previousData = utils.row.infiniteList.getInfiniteData(queryKey)

      // Optimistically update
      utils.row.infiniteList.setInfiniteData(queryKey, (old) => {
        // console.log("Optimistic Update Running. Old Data:", old ? "Found" : "Not Found")
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((row) => {
              if (row.id === newRow.rowId) {
                return {
                  ...row,
                  data: { ...(row.data as Record<string, any>), [newRow.columnId]: newRow.value },
                }
              }
              return row
            }),
          })),
        }
      })

      return { previousData, queryKey }
    },
    onError: (err, newRow, context) => {
      // Rollback
      if (context?.queryKey) {
        utils.row.infiniteList.setInfiniteData(context.queryKey, context.previousData)
      }
    },
    onSettled: (data, error, variables, context) => {
      // Sync with server - invalidate specific query
      if (context?.queryKey) {
        utils.row.infiniteList.invalidate(context.queryKey)
      } else {
        utils.row.infiniteList.invalidate({ tableId })
      }
    },
  })

  // Update createRow/updateCell manually or via refactor?
  // Let's rely on global invalidation logic or update specific calls if needed.
  // Actually, createRow needs to cancel/invalidate the EXACT query key.
  // I'll update it in next step for precision.

  const createView = api.view.create.useMutation({
    onSuccess: () => utils.view.listByTable.invalidate({ tableId })
  })

  // Derived state
  const mappedColumns: Column[] = useMemo(() => (columns || []).map((col: any) => ({
    id: col.id,
    name: col.name,
    type: col.type as any, // "text" | "number" matches
    icon: col.type === "number" ? "#" : "A",
    width: 150 // fixed width for now or persisted later
  })), [columns])

  const mappedRows: Row[] = useMemo(() => {
    const allRows = rowPages?.pages.flatMap(p => p.items) || []
    // Deduplicate by ID to prevent key collisions
    const seen = new Set()
    const uniqueRows = []
    for (const row of allRows) {
      if (!seen.has(row.id)) {
        seen.add(row.id)
        uniqueRows.push(row)
      }
    }
    return uniqueRows.map((row, index) => ({
      id: row.id,
      rowNumber: index + 1,
      data: row.data as Record<string, string>
    }))
  }, [rowPages])

  // Column Visibility
  const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>([])

  const visibleColumns = useMemo(() => {
    return mappedColumns.filter(c => !hiddenColumnIds.includes(c.id))
  }, [mappedColumns, hiddenColumnIds])

  const handleToggleColumnVisibility = (columnId: string) => {
    setHiddenColumnIds(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId)
      } else {
        return [...prev, columnId]
      }
    })
  }

  const handleTableChange = (newTableId: string) => {
    setActiveTableId(newTableId)
    router.push(`/base/${baseId}/table/${newTableId}`)
  }

  const handleAddTable = async () => {
    // Prevent double clicks
    if (createTable.status === "pending") return

    console.log("Adding table to base:", baseId)
    if (!baseId) {
      alert("No base ID found")
      return
    }

    // Smart naming: Find max number in "Table N" names
    const existingNumbers = (tables || [])
      .map(t => {
        const match = t.name.match(/^Table (\d+)$/)
        return match ? parseInt(match[1]) : 0
      })

    // Default to 0 if no match, so max is at least 0. 
    // If Table 1 exists, max is 1. Next is 2.
    const maxNumber = Math.max(0, ...existingNumbers)
    const nextNumber = maxNumber + 1
    const newName = `Table ${nextNumber}`

    const newTable = await createTable.mutateAsync({ baseId, name: newName })
    handleTableChange(newTable.id)
  }

  const handleCellChange = useCallback((rowId: string, colId: string, value: string) => {
    // Optimistic update should be handled by React Query but for Phase 4 we just fire mutation
    updateCell.mutate({ tableId, rowId, columnId: colId, value })
  }, [tableId, updateCell])

  // Bulk Mutation & State
  const [isBulkAdding, setIsBulkAdding] = useState(false)
  const addManyRows = api.row.addMany.useMutation()

  const handleAddRow = useCallback(() => {
    console.log("Add Row Button Clicked")
    createRow.mutate({ tableId })
  }, [tableId, createRow])

  const handleBulkAdd = async (count: number, withMockData: boolean) => {
    setIsBulkAdding(true)
    const BATCH_SIZE = 5000
    const batches = Math.ceil(count / BATCH_SIZE)

    try {
      for (let i = 0; i < batches; i++) {
        const currentBatchSize = Math.min(BATCH_SIZE, count - i * BATCH_SIZE)
        await addManyRows.mutateAsync({
          tableId,
          count: currentBatchSize,
          withMockData
        })
      }
      utils.row.infiniteList.invalidate({ tableId })
    } catch (error) {
      console.error("Bulk add failed", error)
    } finally {
      setIsBulkAdding(false)
    }
  }

  const handleFooterOption = (option: "1" | "50" | "1000" | "10000" | "100000" | "clear") => {
    if (option === "1") {
      handleAddRow()
    } else if (option === "clear") {
      // Implement clear/reset if router exists, otherwise alert not impl
      alert("Clear table not implemented yet (requires dangerous router).")
    } else {
      const count = parseInt(option)
      handleBulkAdd(count, true)
    }
  }

  const handleAddColumn = useCallback((name: string, type: "text" | "number") => {
    createColumn.mutate({ tableId, name: name, type: type })
  }, [tableId, createColumn])

  const handleCreateView = async () => {
    if (!tableId || tableId === "default") {
      alert("Please select a table first.")
      return
    }
    try {
      const newView = await createView.mutateAsync({
        tableId,
        name: `Grid view ${(views?.length || 0) + 1}`,
        type: "grid"
      })
      setActiveViewId(newView.id)
    } catch (e: any) {
      console.error("Failed to create view:", e)
      alert(`Failed to create view: ${e.message}`)
    }
  }

  // Handle Default Table Redirect if needed?
  // Handle Table Validation & Redirect
  useEffect(() => {
    if (!tables) return
    const validIds = tables.map(t => t.id)
    if (tableId === "default" || !validIds.includes(tableId)) {
      if (tables.length > 0) {
        console.log(`Redirecting to valid table: ${tables[0].id}`)
        router.replace(`/base/${baseId}/table/${tables[0].id}`)
      }
    }
  }, [tableId, tables, baseId, router])

  // Loading / Redirecting State Guard
  const isValidTable = tables?.some(t => t.id === tableId)

  // View Persistence
  const { mutate: updateViewMutate } = api.view.update.useMutation()

  // Debounce save view config
  useEffect(() => {
    if (!activeViewId) return
    const timer = setTimeout(() => {
      updateViewMutate({
        viewId: activeViewId,
        config: {
          sort: sortConfig,
          hiddenColumns: hiddenColumnIds,
          // filter: filterConfig 
        }
      })
    }, 1000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeViewId, sortConfig, hiddenColumnIds])

  // If loading, or tables loaded but validId check failed, OR tables loaded but empty (invalid base likely)
  if (!tables || !isValidTable) {
    if (tables && tables.length === 0) {
      return (
        <div className="h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
          <p>Base not found or has no tables.</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => router.push('/')}
          >
            Go Home
          </button>
        </div>
      )
    }
    return <div className="h-screen flex items-center justify-center text-gray-400">Loading Base...</div>
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Left rail */}
      <BaseLeftRail isOmniOpen={isOmniOpen} onOmniToggle={() => setIsOmniOpen(!isOmniOpen)} />
      <OmniPanel isOpen={isOmniOpen} onClose={() => setIsOmniOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Bar A - Base header */}
        <BaseTopHeader baseName="Untitled Base" activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Bar B - Table bar */}
        <TablePeachBar
          tables={tables || []}
          activeTableId={activeTableId === "default" ? "" : activeTableId} // Handle default safely
          onTableChange={handleTableChange}
          onAddTable={handleAddTable}
        />

        {/* Bar C - View toolbar */}
        <ViewToolbar
          views={(views || []) as any}
          columns={mappedColumns}
          activeViewId={activeViewId}
          onViewChange={setActiveViewId}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          currentSort={sortConfig}
          onSortChange={setSortConfig}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          hiddenColumnIds={hiddenColumnIds}
          onToggleHidden={handleToggleColumnVisibility}
        />

        {/* Main area with sidebar and grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Views sidebar */}
          {isSidebarOpen && (
            <ViewsSidebar
              views={views || [] as any}
              activeViewId={activeViewId}
              onViewChange={setActiveViewId}
              onCreateView={handleCreateView}
            />
          )}

          {/* Grid area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <GridTable
              columns={visibleColumns} // Pass VISIBLE columns to grid
              rows={mappedRows}
              onCellChange={handleCellChange}
              onAddRow={handleAddRow}
              onAddColumn={handleAddColumn}
              onFetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
            {/* Footer */}
            <GridFooter
              recordCount={mappedRows.length}
              onAddRow={handleAddRow}
              onAddOption={handleFooterOption}
            />
            {isBulkAdding && (
              <div className="absolute bottom-12 right-4 bg-black text-white px-4 py-2 rounded shadow-lg text-sm flex items-center gap-2 animate-in slide-in-from-bottom-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding rows... this may take a moment
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
