"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react"

interface AvatarUploadProps {
  value?: string
  onChange?: (value: string) => void
}

export default function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      onChange?.(result.imageUrl)
    } catch (error) {
      console.error("Upload error:", error)
      setError("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const removeImage = () => {
    onChange?.("")
    setError(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={value} />
          <AvatarFallback className="bg-base-800 text-base-400">
            <ImageUpIcon className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div
            className={`relative cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors ${isDragging ? "border-accent-600 bg-accent-600/10" : "border-base-600 hover:border-base-500"} ${isUploading ? "pointer-events-none opacity-50" : ""} `}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() =>
              document.getElementById("avatar-file-input")?.click()
            }
          >
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="text-center">
              <ImageUpIcon className="text-base-400 mx-auto mb-2 h-8 w-8" />
              <p className="text-base-300 text-sm">
                {isUploading
                  ? "Uploading..."
                  : "Drop image here or click to browse"}
              </p>
              <p className="text-base-500 mt-1 text-xs">Max size: 5MB</p>
            </div>
          </div>
        </div>

        {value && (
          <button
            type="button"
            onClick={removeImage}
            className="text-base-400 p-2 transition-colors hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircleIcon className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
