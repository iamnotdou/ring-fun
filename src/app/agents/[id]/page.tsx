"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Agent } from "@/components/AgentCard"
import { LastPrice } from "@/components/price"
import { PythChart } from "@/components/pyth-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Assistant } from "@/app/assistant"

interface ExtendedAgent extends Agent {
  _id: string
  createdAt: string
  updatedAt: string
}

export default function AgentDetailPage() {
  const params = useParams()
  const [agent, setAgent] = useState<ExtendedAgent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/agents/${params.id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch agent")
        }

        const data = await response.json()
        setAgent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch agent")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchAgent()
    }
  }, [params.id])

  //   const formatMarketCap = (value: number) => {
  //     if (value >= 1e9) {
  //       return `$${(value / 1e9).toFixed(1)}B`
  //     } else if (value >= 1e6) {
  //       return `$${(value / 1e6).toFixed(1)}M`
  //     } else if (value >= 1e3) {
  //       return `$${(value / 1e3).toFixed(1)}K`
  //     } else {
  //       return `$${value.toFixed(0)}`
  //     }
  //   }

  if (loading) {
    return (
      <div className="border-base-800 mx-auto w-full max-w-6xl border-b xl:border-x">
        <div className="text-center">
          <div className="border-accent-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-white">Loading agent...</p>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="bg-base-950 flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl text-red-400">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-white">
            Error Loading Agent
          </h2>
          <p className="text-base-400 mb-4">{error || "Agent not found"}</p>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="bg-accent-600 hover:bg-accent-700 border-accent-600 text-white"
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-base-800 mx-auto w-full max-w-6xl border-b xl:border-x">
      <div className="border-base-800 relative w-full overflow-hidden border-b px-8 pt-32 pb-12 xl:overflow-visible 2xl:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.6rem] -right-[0.65rem] z-51 hidden size-5 items-center justify-center lg:flex"
        >
          <div className="absolute h-[0.1px] w-full bg-white" />
          <div className="absolute h-full w-[0.1px] bg-white" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.6rem] -left-[0.65rem] z-51 hidden size-5 items-center justify-center lg:flex"
        >
          <div className="absolute h-[0.1px] w-full bg-white" />
          <div className="absolute h-full w-[0.1px] bg-white" />
        </div>
        <div
          aria-hidden="true"
          className="bg-accent-vertical-stripes clip-rect-inset pointer-events-none absolute inset-0 -mx-px ml-auto hidden h-full lg:block lg:w-[50%]"
        />
        <div className="relative max-w-lg text-balance">
          <div className="text-muted-foreground">${agent.ticker} </div>
          <h1 className="text-2xl font-medium tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
            {agent.name}
          </h1>
          <p className="text-base-500 mt-4 text-base">{agent.bio}</p>
          <div className="mt-4 flex justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {agent.topics.map((topic) => (
                <Badge variant="outline" key={topic}>
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div>
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="border-base-800 bg-base-950 grid w-full grid-cols-2 rounded-none">
              <TabsTrigger
                className="cursor-pointer rounded-none text-white"
                value="chat"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                className="cursor-pointer rounded-none text-white"
                value="trade"
              >
                Trade
              </TabsTrigger>
            </TabsList>
            <TabsContent value="trade">
              <div className="w-full">
                <div className="flex flex-row items-start justify-between space-y-0 px-4 py-5 sm:py-6 md:px-6">
                  <div className="flex flex-1 flex-col justify-center gap-1">
                    <div className="text-base-400">{agent.ticker} last 30d</div>
                  </div>
                  <LastPrice
                    benchmark={{
                      t: [
                        1719859200, 1719945600, 1720032000, 1720118400,
                        1720204800, 1720291200, 1720377600, 1720464000,
                        1720550400, 1720636800, 1720723200, 1720809600,
                        1720896000, 1720982400, 1721068800, 1721155200,
                        1721241600, 1721328000, 1721414400, 1721500800,
                        1721587200, 1721673600, 1721760000, 1721846400,
                        1721932800, 1722019200, 1722105600, 1722192000,
                        1722278400, 1722364800,
                      ],
                      o: [
                        29399, 29510, 29388, 29701, 29850, 30105, 30250, 30110,
                        30321, 30500, 30420, 30680, 30815, 30790, 30950, 31100,
                        31250, 31050, 30880, 31150, 31300, 31450, 31200, 31500,
                        31680, 31850, 31700, 31900, 32050, 31890,
                      ],
                      h: [
                        29650, 29600, 29810, 29950, 30200, 30350, 30400, 30450,
                        30600, 30700, 30800, 30950, 31000, 31100, 31250, 31400,
                        31500, 31350, 31250, 31400, 31550, 31600, 31550, 31750,
                        31890, 32000, 32100, 32150, 32250, 32100,
                      ],
                      l: [
                        29350, 29300, 29350, 29650, 29800, 30050, 30000, 30050,
                        30250, 30380, 30400, 30600, 30750, 30700, 30900, 31000,
                        31000, 30950, 30800, 31050, 31200, 31300, 31150, 31400,
                        31600, 31750, 31650, 31800, 31950, 31800,
                      ],
                      c: [
                        29515, 29380, 29710, 29860, 30115, 30240, 30100, 30331,
                        30510, 30430, 30690, 30825, 30780, 30960, 31110, 31260,
                        31040, 30890, 31160, 31310, 31460, 31210, 31510, 31690,
                        31860, 31710, 31910, 32060, 31880, 32010,
                      ],
                      v: [
                        120500, 110200, 130500, 140500, 155200, 148700, 130200,
                        160300, 175400, 160800, 180900, 195100, 182300, 190500,
                        210600, 225400, 201200, 195800, 220100, 235600, 240800,
                        215400, 255900, 265100, 280300, 270800, 295400, 310200,
                        290500, 315800,
                      ],
                      s: "ok",
                    }}
                  />
                </div>
                <CardContent className="w-full px-2 sm:p-6">
                  <div className="flex aspect-auto h-[400px] w-full flex-col items-center justify-center">
                    <Suspense fallback={<ChartSkeleton />}>
                      <PythChart
                        benchmark={Promise.resolve({
                          t: [
                            1719859200, 1719945600, 1720032000, 1720118400,
                            1720204800, 1720291200, 1720377600, 1720464000,
                            1720550400, 1720636800, 1720723200, 1720809600,
                            1720896000, 1720982400, 1721068800, 1721155200,
                            1721241600, 1721328000, 1721414400, 1721500800,
                            1721587200, 1721673600, 1721760000, 1721846400,
                            1721932800, 1722019200, 1722105600, 1722192000,
                            1722278400, 1722364800,
                          ],
                          o: [
                            29399, 29510, 29388, 29701, 29850, 30105, 30250,
                            30110, 30321, 30500, 30420, 30680, 30815, 30790,
                            30950, 31100, 31250, 31050, 30880, 31150, 31300,
                            31450, 31200, 31500, 31680, 31850, 31700, 31900,
                            32050, 31890,
                          ],
                          h: [
                            29650, 29600, 29810, 29950, 30200, 30350, 30400,
                            30450, 30600, 30700, 30800, 30950, 31000, 31100,
                            31250, 31400, 31500, 31350, 31250, 31400, 31550,
                            31600, 31550, 31750, 31890, 32000, 32100, 32150,
                            32250, 32100,
                          ],
                          l: [
                            29350, 29300, 29350, 29650, 29800, 30050, 30000,
                            30050, 30250, 30380, 30400, 30600, 30750, 30700,
                            30900, 31000, 31000, 30950, 30800, 31050, 31200,
                            31300, 31150, 31400, 31600, 31750, 31650, 31800,
                            31950, 31800,
                          ],
                          c: [
                            29515, 29380, 29710, 29860, 30115, 30240, 30100,
                            30331, 30510, 30430, 30690, 30825, 30780, 30960,
                            31110, 31260, 31040, 30890, 31160, 31310, 31460,
                            31210, 31510, 31690, 31860, 31710, 31910, 32060,
                            31880, 32010,
                          ],
                          v: [
                            120500, 110200, 130500, 140500, 155200, 148700,
                            130200, 160300, 175400, 160800, 180900, 195100,
                            182300, 190500, 210600, 225400, 201200, 195800,
                            220100, 235600, 240800, 215400, 255900, 265100,
                            280300, 270800, 295400, 310200, 290500, 315800,
                          ],
                          s: "ok",
                        })}
                      />
                    </Suspense>
                  </div>
                </CardContent>
              </div>
            </TabsContent>
            <TabsContent value="chat">
              <Assistant />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

const ChartSkeleton = () => {
  return (
    <div className="flex h-[400px] w-full animate-pulse items-center justify-center">
      <svg
        height="240"
        viewBox="0 0 1176 1474"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M734.994 589.59C734.994 670.991 669.173 736.992 587.994 736.992V884.393C750.352 884.393 881.994 752.392 881.994 589.59C881.994 426.789 750.352 294.787 587.994 294.787C534.473 294.787 484.21 309.121 440.994 334.254C353.1 385.188 293.994 480.456 293.994 589.59V1326.6L426.168 1459.13L440.994 1474V589.59C440.994 508.189 506.815 442.189 587.994 442.189C669.173 442.189 734.994 508.189 734.994 589.59Z"
          fill="#110F23"
        />
        <path
          d="M588 0C480.891 0 380.498 28.7336 294 78.9342C238.617 111.001 189.019 151.868 147 199.669C55.5156 303.603 0 440.138 0 589.606V1031.81L147 1179.21V589.606C147 458.672 203.779 341.004 294 260.003C336.418 222.002 386.216 192.002 441 172.669C486.942 156.268 536.474 147.402 588 147.402C831.537 147.402 1029 345.404 1029 589.606C1029 833.809 831.537 1031.81 588 1031.81V1179.21C912.783 1179.21 1176 915.21 1176 589.606C1176 264.003 912.783 0 588 0Z"
          fill="#110F23"
        />
      </svg>
    </div>
  )
}
