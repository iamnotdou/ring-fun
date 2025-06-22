import { useCallback, useState } from "react"

import * as PoolClient from "../../packages/pool/dist/index"
import pool from "../contracts/pool"
import {
  connect,
  disconnect,
  getPublicKey,
  signTransaction,
} from "../lib/stellar-wallets-kit"

interface SwapParams {
  direction: boolean
  amount: bigint
}

interface SwapResult {
  success: boolean
  transactionHash?: string
  amountOut?: string
  error?: string
}

interface UseSwapHook {
  swap: (direction: boolean, amount: bigint) => Promise<SwapResult>
  isSwapping: boolean
  error: string | null
  lastResult: SwapResult | null
  reset: () => void
}

export const useSwap = (): UseSwapHook => {
  const [isSwapping, setIsSwapping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<SwapResult | null>(null)

  const reset = useCallback(() => {
    setError(null)
    setLastResult(null)
    setIsSwapping(false)
  }, [])

  const swap = useCallback(
    async (direction: boolean, amount: bigint): Promise<SwapResult> => {
      setIsSwapping(true)
      setError(null)
      try {
        // Get the public key from the connected wallet
        const publicKey = await getPublicKey()
        if (!publicKey) {
          throw new Error("No wallet connected or public key not available")
        }

        pool.options.signTransaction = signTransaction
        pool.options.publicKey = publicKey

        const deployTx = await pool.swap({
          caller: publicKey,
          is_in_x: direction,
          amount_in: 0,
        })

        const result = await deployTx.signAndSend()

        const swapResult: SwapResult = {
          success: true,
          transactionHash: result.hash,
          // You might need to parse the result to get the actual amount out
          // This depends on how the PoolClient returns the swap result
          amountOut: result.returnValue?.toString() || undefined,
        }

        setLastResult(swapResult)
        return swapResult
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Swap failed"
        setError(errorMessage)

        const result: SwapResult = {
          success: false,
          error: errorMessage,
        }

        setLastResult(result)
        return result
      } finally {
        setIsSwapping(false)
      }
    },
    []
  )

  return {
    swap,
    isSwapping,
    error,
    lastResult,
    reset,
  }
}
