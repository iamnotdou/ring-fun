"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SortDesc } from "lucide-react"

import AgentCard, { Agent } from "./AgentCard"

interface AgentListProps {
  agents: Agent[]
  onAgentClick?: (agent: Agent) => void
}

export default function AgentList({ agents, onAgentClick }: AgentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "marketCap" | "recent">(
    "marketCap"
  )

  const filteredAndSortedAgents = agents
    .filter(
      (agent) =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.topics.some((topic) =>
          topic.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "marketCap":
          return b.marketCap - a.marketCap
        case "recent":
          return 0 // For now, as we don't have creation date
        default:
          return 0
      }
    })

  return (
    <div className="w-full p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">AI Agents</h2>
            <p className="text-base-400 mt-1">
              {agents.length} agent{agents.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {/* Sort Controls */}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="text-base-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search agents, tickers, or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-base-800 border-base-600 placeholder:text-base-400 pl-10 text-white"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedAgents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onClick={onAgentClick} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="text-base-400 mb-2 text-lg">
            {searchTerm
              ? "No agents found matching your search."
              : "No agents available yet."}
          </div>
          <p className="text-base-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Create your first AI agent to get started!"}
          </p>
        </div>
      )}
    </div>
  )
}
