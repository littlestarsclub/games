export const playCorrect = () => {
  const sound = new Audio(
    'sounds/correct.mp3'
  )

  sound.volume = 0.4

  sound.play()
}

export const playWrong = () => {
  const sound = new Audio(
    'sounds/wrong.mp3'
  )

  sound.volume = 0.35

  sound.play()
}