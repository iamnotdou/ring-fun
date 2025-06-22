"use client"

import { useEffect, useState } from "react"

import { connect, disconnect, getPublicKey } from "../lib/stellar-wallets-kit"
import { Button } from "./ui/button"

export default function ConnectWalletUI() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected on component mount
    const checkConnection = async () => {
      try {
        const key = await getPublicKey()
        setPublicKey(key)
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkConnection()
  }, [])

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connect(async () => {
        const key = await getPublicKey()
        setPublicKey(key)
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = async () => {
    setIsLoading(true)
    try {
      await disconnect(async () => {
        setPublicKey(null)
      })
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="mx-auto flex w-72 items-center justify-center gap-3 text-center"
      role="region"
      aria-live="polite"
    >
      <div className="flex-1 overflow-hidden text-center text-ellipsis whitespace-nowrap">
        {publicKey && (
          <span title={publicKey} className="text-muted-foreground text-sm">
            Signed in as {publicKey}
          </span>
        )}
      </div>

      {!publicKey ? (
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <Button
          onClick={handleDisconnect}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? "Disconnecting..." : "Disconnect"}
        </Button>
      )}
    </div>
  )
}
