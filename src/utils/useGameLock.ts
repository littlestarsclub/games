import { useState } from 'react'

export function useGameLock() {
  const [isLocked, setIsLocked] =
    useState(false)

  const [isSpeaking, setIsSpeaking] =
    useState(false)

  const disableUI =
    isLocked || isSpeaking

  return {
    isLocked,
    setIsLocked,

    isSpeaking,
    setIsSpeaking,

    disableUI,
  }
}