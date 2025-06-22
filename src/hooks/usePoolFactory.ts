import { useCallback, useState } from "react"
import { FeeBumpTransaction, Transaction } from "@stellar/stellar-sdk"
import { Api, Server } from "@stellar/stellar-sdk/rpc"

import * as PoolClient from "../../packages/pool/dist/index"
import pool from "../contracts/pool"
import {
  connect,
  disconnect,
  getPublicKey,
  signTransaction,
} from "../lib/stellar-wallets-kit"

const PEER_CONTRACT = "CD7LAIDP3HLUTNXGI54NFKPKQC2IKVLL7RVU4GHHQTGAQBIIWX57V563"
const POOL_WASM_HASH =
  "a980c4120f8451ce00b71143333fb6e88c3fa8e0614c5aee18e37ba5a023d659"
const TOKEN_WASM_HASH =
  "c58905824d6ea65d0f49672e18b6e926dbf1e7dcc651ce4181fb866835000545"

interface PoolDeployParams {
  symbol: string
  name: string
}

interface DeployResult {
  success: boolean
  transactionHash?: string
  contractAddress?: string
  error?: string
}

interface UsePoolDeployHook {
  deploy: (params: PoolDeployParams) => Promise<DeployResult>
  isDeploying: boolean
  error: string | null
  lastResult: DeployResult | null
  reset: () => void
}

export const usePoolDeploy = (): UsePoolDeployHook => {
  const [isDeploying, setIsDeploying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<DeployResult | null>(null)

  const reset = useCallback(() => {
    setError(null)
    setLastResult(null)
    setIsDeploying(false)
  }, [])

  const deploy = useCallback(
    async (params: PoolDeployParams): Promise<DeployResult> => {
      setIsDeploying(true)
      setError(null)

      try {
        const publicKey = await getPublicKey()

        if (!publicKey) {
          throw new Error("No wallet connected or public key not available")
        }

        pool.options.signTransaction = signTransaction
        pool.options.publicKey = publicKey

        const deployTx = await pool.swap({
          caller: publicKey,
          is_in_x: true,
          amount_in: 0,
        })

        const result = await deployTx.signAndSend()

        // const deployTx = await PoolClient.Client.deploy(
        //   {
        //     peer_contract: PEER_CONTRACT,
        //     wasm_hash: Buffer.from(TOKEN_WASM_HASH, "hex"),
        //     symbol: params.symbol,
        //     name: params.name,
        //   },
        //   {
        //     wasmHash: POOL_WASM_HASH,
        //     rpcUrl: "https://soroban-testnet.stellar.org:433",
        //     networkPassphrase: "Test SDF Network ; September 2015", // Add network passphrase
        //     publicKey: publicKey,
        //     signTransaction: signTransaction, // Pass the signing function
        //     allowHttp: true,
        //   }
        // )
        // console.log("asd1")
        //
        // console.log(deployTx)

        // Sign and send the transaction
        // const result = await deployTx.signAndSend()

        const deployResult: DeployResult = {
          success: true,
          transactionHash: result.hash,
          contractAddress: deployTx.contractId,
        }

        setLastResult(deployResult)
        return deployResult
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Deployment failed"
        setError(errorMessage)

        const result: DeployResult = {
          success: false,
          error: errorMessage,
        }

        setLastResult(result)
        return result
      } finally {
        setIsDeploying(false)
      }
    },
    []
  )

  return {
    deploy,
    isDeploying,
    error,
    lastResult,
    reset,
  }
}
