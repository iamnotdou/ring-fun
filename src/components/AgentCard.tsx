import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Agent {
  id: string
  name: string
  ticker: string
  avatar?: string
  marketCap: number
  bio: string
  topics: string[]
  personalityTraits: string[]
  writingStyle: string
  chatStyle: string
  agentBehavior: string
}

interface AgentCardProps {
  agent: Agent
  onClick?: (agent: Agent) => void
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const formatMarketCap = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`
    } else {
      return `$${value.toFixed(0)}`
    }
  }

  return (
    <div
      className="bg-base-900 border-base-800 hover:border-accent-600/50 group cursor-pointer transition-all duration-300"
      onClick={() => onClick?.(agent)}
    >
      <div className="p-0">
        <div className="flex h-full flex-col justify-between">
          {/* Top section with pattern */}
          <div className="bg-light-horizontal-stripes aspect-[12/1]"></div>

          {/* Content section */}
          <div className="bg-base-900 h-full p-4 pb-6">
            {/* Avatar and basic info */}
            <div className="mb-3 flex items-start gap-3">
              <Avatar className="border-base-700 bg-base-800 h-10 w-10 rounded-none border-2">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback className="bg-base-800 text-base-300 text-sm font-semibold">
                  {agent.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="group-hover:text-accent-300 truncate text-base font-semibold text-white transition-colors">
                  {agent.name}
                </h3>
                <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                  ${agent.ticker}
                </div>
              </div>
            </div>

            {/* Market cap */}
            <div className="">
              <p className="text-muted-foreground mb-1 text-xs">Market Cap</p>
              <p className="">{formatMarketCap(agent.marketCap)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
