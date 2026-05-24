import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'

const animals = [
  {
    emoji: '🐶',
    name: 'DOG',
    vi: 'CHÓ',
    soundFile: 'dog.mp3',
  },
  {
    emoji: '🐱',
    name: 'CAT',
    vi: 'MÈO',
    soundFile: 'cat.mp3',
  },
  {
    emoji: '🐮',
    name: 'COW',
    vi: 'BÒ',
    soundFile: 'cow.mp3',
  },
  {
    emoji: '🐔',
    name: 'CHICKEN',
    vi: 'GÀ',
    soundFile: 'chicken.mp3',
  },
  {
    emoji: '🐴',
    name: 'HORSE',
    vi: 'NGỰA',
    soundFile: 'horse.mp3',
  },
]

export default function AnimalSoundGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
  const [target, setTarget] = useState(animals[0])
  const [choices, setChoices] = useState<typeof animals>([])
  const [score, setScore] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [streak, setStreak] =  useState(0)

  useEffect(() => {
    nextRound()
  }, [])

  const nextRound = () => {
    const randomAnimal =
      animals[Math.floor(Math.random() * animals.length)]
    setTarget(randomAnimal)

    let wrong = animals
      .filter(a => a.name !== randomAnimal.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)

    const allChoices = [...wrong, randomAnimal].sort(
      () => Math.random() - 0.5
    )

    setChoices(allChoices)
  }

  const playSound = () => {
    new Audio(`/sounds/${target.soundFile}`).play()
  }

  const speakQuestion = async () => {
    await speak('Which animal makes this sound?')
    await speak('Con vật nào tạo ra âm thanh này?', 'vi-VN')
    playSound()
  }

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () =>
    praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
  
  const handleClick = (animal: typeof animals[0]) => {
    if (animal.name === target.name) {
      playCorrect()
	  if (streak === 2) {speak('Amazing streak!')}
	  if (streak === 4) {speak('Super learner!')}
	  if (streak === 9) {speak('WOW! Superstar!')}
      addStar()
	  setStreak((prev) => prev + 1)
      setScore(prev => prev + 1)
      setShowCelebrate(true)

      speak(`${randomPraise()} ${animal.name}!`)
      setTimeout(() => speak(animal.vi, 'vi-VN'), 800)

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
      }, 1800)
    } else {
      playWrong()
	  setStreak(0)
      speak('Try again!')
    }
  }

  return (
    <>
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🐾 Animal Sound Game</h2>

      <h2 style={{ color: '#ff7b00', marginTop: 10 }}>
        ⭐ Score: {score}
      </h2>
       <h3>🔥 Streak: {streak}</h3>
		{streak >= 3 && (
		<div
			style={{
			fontSize: 32,
			marginBottom: 20,
			color: '#ff4757',
			animation:
			'pop 0.5s ease',
			}}
		>
		🔥 Amazing Streak!
		</div>
		)}
      {showCelebrate && (
        <div style={{ fontSize: 60, marginTop: 20, animation: 'pop 0.6s ease' }}>
          🎉 ⭐ 🌟
        </div>
      )}

      <p style={{ fontSize: 22, marginTop: 20 }}>
        Listen to the sound and choose the correct animal:
      </p>

      <button onClick={playSound} style={speakButton}>
        🔊 Play Sound
      </button>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 30,
          flexWrap: 'wrap',
        }}
      >
        {choices.map((animal, i) => (
          <button
            key={i}
            onClick={() => handleClick(animal)}
            style={emojiButton}
          >
            {animal.emoji}
          </button>
        ))}
      </div>

      <button onClick={speakQuestion} style={speakButton}>
        🔊 Hear Question
      </button>

      <button onClick={nextRound} style={nextButton}>
        ➡️ Next
      </button>
    </>
  )
}
