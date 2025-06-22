import { useMemo } from "react"
import { Triangle } from "lucide-react"

import { Benchmark } from "@/lib/pyth"
import { cn } from "@/lib/utils"

interface LastPriceProps {
  benchmark: Benchmark
}

export const LastPrice = (props: LastPriceProps) => {
  const { benchmark } = props

  const percentageChange = useMemo(() => {
    const firstValue = benchmark.c[0]
    const lastValue = benchmark.c.at(-1) ?? 0

    return ((lastValue - firstValue) / firstValue) * 100
  }, [benchmark])

  const isTrendingUp = percentageChange > 0

  return (
    <span className="inline-flex flex-row items-center gap-2 font-mono text-sm md:text-lg">
      <span>
        <Triangle
          className={cn("size-3", {
            "fill-chart-2 stroke-chart-2": isTrendingUp,
            "fill-chart-5 stroke-chart-5 rotate-180": !isTrendingUp,
          })}
        />
      </span>
      <span
        className={cn({
          "text-chart-2": isTrendingUp,
          "text-chart-5": !isTrendingUp,
        })}
      >
        {percentageChange.toFixed(2)}%
      </span>
      <span>|</span>
      {benchmark.c
        .at(-1)
        ?.toLocaleString("en-US", { style: "currency", currency: "USD" }) ??
        "Loading..."}
    </span>
  )
}
