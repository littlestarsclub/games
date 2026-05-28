import { speak } from './speak'

type AudioOptions = {
  speech?: string[]
  vietnamese?: string[]
  soundFile?: string
  setIsSpeaking: (
    value: boolean
  ) => void
}

export async function playGameAudio({
  speech = [],
  vietnamese = [],
  soundFile,
  setIsSpeaking,
}: AudioOptions) {
  setIsSpeaking(true)

  try {
    // English lines
    for (const line of speech) {
      await speak(line)
    }

    // Vietnamese lines
    for (const line of vietnamese) {
      await speak(line, 'vi-VN')
    }

    // Animal sound / effect sound
    if (soundFile) {
      await new Promise<void>(
        async (resolve) => {
          const audio =
            new Audio(
              `sounds/${soundFile}`
            )

          audio.onended = () =>
            resolve()

          await audio.play()
        }
      )
    }
  } finally {
    setIsSpeaking(false)
  }
}