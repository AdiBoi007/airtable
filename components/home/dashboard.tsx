"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, List, LayoutGrid } from "lucide-react"
import { TopHomeBar } from "@/components/shell/top-home-bar"
import { HomeLeftRail } from "@/components/shell/home-left-rail"
import { StartModal } from "@/components/home/start-modal"
import { TemplateCard } from "@/components/home/template-card"
import { BaseCard } from "@/components/home/base-card"
import { BaseListRow } from "@/components/home/base-list-row"
import { templateCards, formatRelativeTime } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { api } from "@/trpc/react"

import { useEffect } from "react"
import { AirtableLogo } from "@/components/icons/airtable-logo"

export default function Dashboard() {
    const router = useRouter()
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
    const [isStartModalOpen, setIsStartModalOpen] = useState(false)
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid")

    // ✅ Hooks FIRST — no conditions or early returns
    const { data: bases, isLoading } = api.base.list.useQuery()

    const createBase = api.base.create.useMutation({
        onSuccess: () => {
            // refetch handled by react-query usually, or we push to new base
        }
    })

    // const utils = api.useUtils() // Unused

    const todayBases = bases?.filter((base: any) => {
        const hours = (Date.now() - base.createdAt.getTime()) / (1000 * 60 * 60)
        return hours < 24
    }) || []

    const pastWeekBases = bases?.filter((base: any) => {
        const hours = (Date.now() - base.createdAt.getTime()) / (1000 * 60 * 60)
        return hours >= 24
    }) || []

    const handleBaseClick = (baseId: string) => {
        router.push(`/base/${baseId}/table/default`)
    }

    const handleCreateOption = async (option: "ai" | "manual") => {
        setIsStartModalOpen(false)
        if (option === "manual") {
            // Create a new base
            const newBase = await createBase.mutateAsync({ name: "Untitled Base" })
            // Redirect to the new base using the real table ID
            router.push(`/base/${newBase.id}/table/${newBase.defaultTableId}`)
        }
    }

    const renderBases = (baseList: any[], sectionTitle: string) => {
        if (!baseList || baseList.length === 0) return null

        return (
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">{sectionTitle}</h3>

                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {baseList.map((base: any) => (
                            <BaseCard
                                key={base.id}
                                name={base.name}
                                icon={"Un"} // Mock icon
                                color={"#0d7377"} // Mock color
                                openedAt={formatRelativeTime(base.createdAt)}
                                onClick={() => handleBaseClick(base.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {baseList.map((base: any) => (
                            <BaseListRow
                                key={base.id}
                                name={base.name}
                                icon={"Un"}
                                color={"#0d7377"}
                                openedAt={formatRelativeTime(base.createdAt)}
                                onClick={() => handleBaseClick(base.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    return (
        <div className="h-screen flex flex-col bg-white">
            <TopHomeBar onMenuClick={() => setIsSidebarExpanded(!isSidebarExpanded)} />

            <div className="flex flex-1 overflow-hidden">
                <HomeLeftRail
                    onItemClick={() => { }}
                    onCreateClick={() => setIsStartModalOpen(true)}
                    isExpanded={isSidebarExpanded}
                    onExpandedChange={setIsSidebarExpanded}
                />

                {/* Main content */}
                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-6xl">
                        {/* Title */}
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Home</h1>

                        {/* Start building section */}
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Start building</h2>
                            <p className="text-sm text-gray-500 mb-4">Create apps instantly with AI</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {templateCards.map((card) => (
                                    <TemplateCard
                                        key={card.id}
                                        icon={card.icon}
                                        title={card.title}
                                        description={card.description}
                                        onClick={() => setIsStartModalOpen(true)}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Opened anytime section */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900">
                                    <span className="font-medium">Opened anytime</span>
                                    <ChevronDown className="h-4 w-4" />
                                </button>

                                <TooltipProvider>
                                    <div className="flex items-center gap-1">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => setViewMode("list")}
                                                    className={cn(
                                                        "p-1.5 rounded hover:bg-gray-100",
                                                        viewMode === "list" ? "text-gray-900" : "text-gray-400",
                                                    )}
                                                >
                                                    <List className="h-5 w-5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <p>View items in a list</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() => setViewMode("grid")}
                                                    className={cn(
                                                        "p-1.5 rounded hover:bg-gray-100",
                                                        viewMode === "grid" ? "text-gray-900" : "text-gray-400",
                                                    )}
                                                >
                                                    <LayoutGrid className="h-5 w-5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="top">
                                                <p>View items in a grid</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </TooltipProvider>
                            </div>

                            {viewMode === "list" && (
                                <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 border-b border-gray-200 mb-2">
                                    <div className="w-8 flex-shrink-0" /> {/* Icon spacer */}
                                    <div className="ml-3 flex-1">Name</div>
                                    <div className="w-48 flex-shrink-0">Last opened</div>
                                    <div className="w-48 flex-shrink-0 text-right">Workspace</div>
                                </div>
                            )}

                            {renderBases(todayBases, "Today")}
                            {renderBases(pastWeekBases, "Past 7 days")}
                        </section>
                    </div>
                </main>
            </div>

            {/* Start modal */}
            <StartModal
                isOpen={isStartModalOpen}
                onClose={() => setIsStartModalOpen(false)}
                onSelectOption={handleCreateOption}
            />
        </div>
    )
}
