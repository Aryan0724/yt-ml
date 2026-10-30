"use client"

import React, { useRef, useEffect } from "react"

interface OtpInputProps {
  value: string[]
  onChange: (digits: string[]) => void
  onComplete?: (code: string) => void
  disabled?: boolean
  hasError?: boolean
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus the first empty input on mount
    const firstEmpty = value.findIndex((d) => !d)
    const targetIdx = firstEmpty === -1 ? 0 : firstEmpty
    inputRefs.current[targetIdx]?.focus()
  }, [])

  const handleChange = (index: number, char: string) => {
    // Keep only numbers
    const cleanChar = char.replace(/[^0-9]/g, "")
    if (!cleanChar && char !== "") return

    const newDigits = [...value]
    newDigits[index] = cleanChar.slice(-1) // single digit
    onChange(newDigits)

    // If digit entered, advance to next input
    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // If all 6 digits filled, trigger auto-complete
    const fullCode = newDigits.join("")
    if (fullCode.length === 6 && onComplete) {
      onComplete(fullCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // Move to previous box on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6)
    if (!pasted) return

    const newDigits = [...value]
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || ""
    }
    onChange(newDigits)

    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()

    if (pasted.length === 6 && onComplete) {
      onComplete(pasted)
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[idx] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all duration-150 outline-none
            ${
              hasError
                ? "border-red-500 bg-red-50/50 text-red-900 focus:ring-2 focus:ring-red-400"
                : value[idx]
                ? "border-neutral-900 bg-white text-neutral-950 ring-1 ring-neutral-900/10 shadow-xs"
                : "border-neutral-200 bg-neutral-50/80 text-neutral-900 focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-500/20"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
          `}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  )
}
