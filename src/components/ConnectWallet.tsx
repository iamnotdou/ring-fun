"use client"

import { useEffect, useState } from "react"

import { connect, disconnect, getPublicKey } from "../lib/stellar-wallets-kit"

export default function ConnectWallet() {
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
      className="mx-auto flex w-72 justify-center gap-2 text-center leading-[2.7rem]"
      role="region"
      aria-live="polite"
    >
      <div className="overflow-hidden text-center text-ellipsis whitespace-nowrap">
        {publicKey && (
          <span title={publicKey} className="text-sm">
            Signed in as {publicKey}
          </span>
        )}
      </div>

      {!publicKey ? (
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-4 py-2 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-describedby="connect-wrap"
        >
          {isLoading ? "Connecting..." : "Connect"}
        </button>
      ) : (
        <button
          onClick={handleDisconnect}
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-4 py-2 transition-all duration-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-describedby="connect-wrap"
        >
          {isLoading ? "Disconnecting..." : "Disconnect"}
        </button>
      )}
    </div>
  )
}
