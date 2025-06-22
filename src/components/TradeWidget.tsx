"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useSwap } from "@/hooks/useSwap"

export default function TradeWidget() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const { swap } = useSwap()

  // Bonding curve parameters
  const INITIAL_VIRTUAL_LIQUIDITY = 1000000
  // const TARGET_VIRTUAL_LIQUIDITY = 500000
  const INITIAL_RESERVE_X = 1000000

  const [currentReserveX, setCurrentReserveX] = useState(INITIAL_RESERVE_X)
  const [currentVirtualY, setCurrentVirtualY] = useState(
    INITIAL_VIRTUAL_LIQUIDITY
  )

  const k = currentReserveX * currentVirtualY

  // const bondingCurveProgress =
  //   ((INITIAL_VIRTUAL_LIQUIDITY - currentVirtualY) /
  //     (INITIAL_VIRTUAL_LIQUIDITY - TARGET_VIRTUAL_LIQUIDITY)) *
  //   100

  const currentPrice = currentVirtualY / currentReserveX

  const calculateQuote = (inputAmount: string, isBuy: boolean) => {
    if (
      !inputAmount ||
      isNaN(Number(inputAmount)) ||
      Number(inputAmount) <= 0
    ) {
      return { outputAmount: 0, newPrice: currentPrice, priceImpact: 0 }
    }

    const amountIn = Number(inputAmount)

    if (isBuy) {
      const newReserveX = currentReserveX + amountIn
      const newVirtualY = k / newReserveX
      const outputAmount = currentVirtualY - newVirtualY
      const newPrice = newVirtualY / newReserveX
      const priceImpact = ((newPrice - currentPrice) / currentPrice) * 100

      return {
        outputAmount: Math.max(0, outputAmount),
        newPrice,
        priceImpact,
      }
    } else {
      const newVirtualY = currentVirtualY + amountIn
      const newReserveX = k / newVirtualY
      const outputAmount = currentReserveX - newReserveX
      const newPrice = newVirtualY / newReserveX
      const priceImpact = ((newPrice - currentPrice) / currentPrice) * 100

      return {
        outputAmount: Math.max(0, outputAmount),
        newPrice,
        priceImpact,
      }
    }
  }

  const quote = calculateQuote(amount, tradeType === "buy")

  const presetAmounts = ["reset", "100", "500", "1000", "max"]

  const handlePresetClick = (preset: string) => {
    if (preset === "reset") {
      setAmount("")
    } else if (preset === "max") {
      setAmount("10000")
    } else {
      setAmount(preset)
    }
  }

  const onSwap = async () => {
    if (!amount || quote.outputAmount <= 0) return

    const amountIn = Number(amount)

    const tradeDirection = tradeType == "buy" ? false : true
    await swap(tradeDirection, BigInt(amount))

    if (tradeType === "buy") {
      setCurrentReserveX((prev) => prev + amountIn)
      setCurrentVirtualY((prev) => k / (prev + amountIn))
    } else {
      setCurrentVirtualY((prev) => prev + amountIn)
      setCurrentReserveX((prev) => k / (prev + amountIn))
    }

    setAmount("")
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="space-y-6 rounded-lg border border-gray-700 bg-gray-900 p-6">
        <div className="rounded-lg bg-gray-800 p-4 text-center">
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-xl font-bold text-white">
            {currentPrice.toFixed(8)} Y/X
          </div>
        </div>

        <Tabs
          value={tradeType}
          onValueChange={(value) => setTradeType(value as "buy" | "sell")}
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Buy X
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Sell Y
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Amount Input Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            Amount ({tradeType === "buy" ? "X" : "Y"})
          </label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12 border-gray-600 bg-gray-800 pr-16 text-white"
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-gray-400">
              {tradeType === "buy" ? "X" : "Y"}
            </div>
          </div>
        </div>

        {amount && quote.outputAmount > 0 && (
          <div className="space-y-2 rounded-lg bg-gray-800 p-4">
            <div className="text-sm text-gray-400">You will receive</div>
            <div className="text-lg font-semibold text-white">
              {quote.outputAmount.toFixed(6)} {tradeType === "buy" ? "Y" : "X"}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            Quick amounts
          </label>
          <div className="flex gap-2">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className="border-gray-600 bg-gray-800 text-xs text-white hover:bg-gray-700"
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        <Button
          className={`h-12 w-full ${
            tradeType === "buy"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } font-medium text-white disabled:opacity-50`}
          onClick={onSwap}
          disabled={!amount || quote.outputAmount <= 0}
        >
          {tradeType === "buy" ? "Buy" : "Sell"} {amount || "0"}{" "}
          {tradeType === "buy" ? "X" : "Y"}
        </Button>
      </div>
    </div>
  )
}
