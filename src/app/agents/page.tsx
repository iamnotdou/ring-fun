"use client"

import { useEffect, useState } from "react"
import { Agent } from "@/components/AgentCard"
import AgentList from "@/components/AgentList"

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        "/api/agents?limit=50&sortBy=marketCap&sortOrder=desc"
      )

      if (!response.ok) {
        throw new Error("Failed to fetch agents")
      }

      const data = await response.json()
      setAgents(data.agents)
      console.log(data.agents)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agents")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const handleAgentClick = (agent: Agent) => {
    console.log("Clicked agent:", agent)
    // You can implement agent detail view or other actions here
  }

  if (loading) {
    return (
      <div className="border-base-800 mx-auto w-full max-w-6xl border-b xl:border-x">
        <main>
          <div className="relative flex flex-col justify-between overflow-hidden">
            <div className="relative mx-auto w-full py-12 backdrop-blur-3xl">
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                  <div className="border-accent-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                  <p className="text-white">Loading agents...</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-base-800 mx-auto w-full max-w-6xl border-b xl:border-x">
        <main>
          <div className="relative flex flex-col justify-between overflow-hidden">
            <div className="relative mx-auto w-full py-12 backdrop-blur-3xl">
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl text-red-400">⚠️</div>
                  <h2 className="mb-2 text-xl font-semibold text-white">
                    Error Loading Agents
                  </h2>
                  <p className="text-base-400 mb-4">{error}</p>
                  <button
                    onClick={fetchAgents}
                    className="bg-accent-600 hover:bg-accent-700 rounded-md px-4 py-2 text-white"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="border-base-800 mx-auto w-full max-w-6xl border-b xl:border-x">
      <main>
        <div className="relative flex flex-col justify-between overflow-hidden">
          <div className="relative mx-auto w-full py-12 backdrop-blur-3xl">
            <AgentList agents={agents} onAgentClick={handleAgentClick} />
          </div>
        </div>
      </main>
    </div>
  )
}
