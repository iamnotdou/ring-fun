"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TradeWidget() {
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")

  const presetAmounts = ["reset", "100", "500", "1000", "max"]

  const handlePresetClick = (preset: string) => {
    if (preset === "reset") {
      setAmount("")
    } else if (preset === "max") {
      setAmount("1000") // Mock max amount
    } else {
      setAmount(preset)
    }
  }

  return (
    <div className="w-full">
      <div className="bg-base-900 border-base-800 space-y-6 border p-6">
        {/* Trade Type Toggle */}
        <Tabs
          value={tradeType}
          onValueChange={(value) => setTradeType(value as "buy" | "sell")}
        >
          <TabsList className="bg-base-800 grid w-full grid-cols-2">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Configuration Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-base-800 border-base-700 hover:bg-base-700 text-white"
          >
            Switch to USDC
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-base-800 border-base-700 hover:bg-base-700 text-white"
          >
            Set Slippage
          </Button>
        </div>

        {/* Amount Input Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Amount</label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-base-800 border-base-700 h-12 pr-16 text-white"
            />
            <div className="text-base-400 absolute top-1/2 right-3 -translate-y-1/2 text-sm">
              XLM
            </div>
          </div>
        </div>

        {/* Preset Amount Buttons */}
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
                className="bg-base-800 border-base-700 hover:bg-base-700 text-xs text-white"
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        {/* Trade Info */}
        <div className="border-base-800 space-y-2 border-t pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-base-400">Network</span>
            <span className="text-white">Stellar</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-base-400">Fee</span>
            <span className="text-white">~0.00001 XLM</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <Button
          className={`h-12 w-full ${
            tradeType === "buy"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } font-medium text-white`}
        >
          {tradeType === "buy" ? "Buy" : "Sell"} XLM
        </Button>
      </div>
    </div>
  )
}
