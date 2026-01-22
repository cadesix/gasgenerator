'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface CopyButtonProps {
  text: string
  label: string
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Button size="sm" variant="ghost" onClick={handleCopy}>
      {copied ? 'Copied!' : label}
    </Button>
  )
}
