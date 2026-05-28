import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { playGameAudio } from '../utils/playGameAudio'

const easyItems  = [
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

const mediumItems = [
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
  {
    emoji: '🐷',
    name: 'PIG',
    vi: 'HEO',
    soundFile: 'pig.mp3',
  },
  {
    emoji: '🐑',
    name: 'SHEEP',
    vi: 'CỪU',
    soundFile: 'sheep.mp3',
  },
]

const hardItems = [
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
  {
    emoji: '🐷',
    name: 'PIG',
    vi: 'HEO',
    soundFile: 'pig.mp3',
  },
  {
    emoji: '🐑',
    name: 'SHEEP',
    vi: 'CỪU',
    soundFile: 'sheep.mp3',
  },
  {
    emoji: '🦆',
    name: 'DUCK',
    vi: 'VỊT',
    soundFile: 'duck.mp3',
  },
  {
    emoji: '🐸',
    name: 'FROG',
    vi: 'ẾCH',
    soundFile: 'frog.mp3',
  },
]

export default function AnimalSoundGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
}: {
  onBack: () => void
  addStar: () => void
  difficulty: string
  completeGame: ( gameName: string ) => void
}) {
const animals =
  difficulty === 'easy'
    ? easyItems
    : difficulty === 'medium'
    ? mediumItems
    : hardItems

const [target, setTarget] = useState(animals[0])
const [choices, setChoices] = useState<Array<typeof animals[0]>>([])
const [direction, setDirection] = useState<'enToVi' | 'viToEn'>('enToVi')
const [score, setScore] = useState(0)
const [showCelebrate, setShowCelebrate] = useState(false)
const [streak, setStreak] = useState(0)
const {isLocked,  setIsLocked, isSpeaking, setIsSpeaking, disableUI, } = useGameLock() 

  useEffect(() => {
    nextRound()
  }, [difficulty])

const nextRound = () => {
  if (disableUI) return
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
  setTarget(randomAnimal)

  const dir = Math.random() > 0.5 ? 'enToVi' : 'viToEn'
  setDirection(dir)

  const choiceCount =
    difficulty === 'easy' ? 3 :
    difficulty === 'medium' ? 5 :
    7

  let wrongChoices = animals
    .filter(a => a.name !== randomAnimal.name)
    .sort(() => Math.random() - 0.5)
    .slice(0, choiceCount - 1)

  const allChoices = [...wrongChoices, randomAnimal].sort(
    () => Math.random() - 0.5
  )

  setChoices(allChoices)
}

const playSound = async () => {
  if (disableUI) return

  await playGameAudio({
    soundFile: target.soundFile,
    setIsSpeaking,
  })
}

const speakQuestion = async () => {
  if (disableUI) return

  await playGameAudio({
    speech: [
      'Which animal makes this sound?'
    ],

    vietnamese: [
      'Con vật nào tạo ra âm thanh này?'
    ],

    soundFile: target.soundFile,

    setIsSpeaking,
  })
}

  const praises = ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!']
  const randomPraise = () =>
    praises[Math.floor(Math.random() * praises.length)]
  const praisesVN = ['Làm tốt lắm!', 'Tuyệt vời!', 'Thật tuyệt diệu!', 'Đỉnh quá!', 'Hoan hô!']
  const randomPraiseVN = () => praisesVN[Math.floor(Math.random() * praisesVN.length)]
  
  const handleClick = async (animal: typeof animals[0]) => {
	  if (disableUI) return
    if (animal.name === target.name) {
      playCorrect()
	  setIsLocked(true)
	  if (streak === 2) {speak('Amazing streak!')}
	  if (streak === 4) {speak('Super learner!')}
	  if (streak === 9) {speak('WOW! Superstar!')}
      addStar()
	  setStreak((prev) => prev + 1)
	  const newScore = score + 1
	  setScore(newScore)
	  if (newScore >= 5) {completeGame('animalSound')}
      setShowCelebrate(true)
      await speak(`${randomPraise()} ${animal.name}!`)
	  await speak(`${randomPraiseVN()} ${animal.vi}!`, 'vi-VN')
      setTimeout(() => {
  setShowCelebrate(false)

  nextRound()

  setIsLocked(false)
}, 2000)
    } else {
  setIsLocked(true)
      playWrong()
	  setStreak(0)
      await speak('Try again!')
      await speak('Thử lại nhé!', 'vi-VN')
	  setIsLocked(false)
    }
  }

  return (
    <>
      <button onClick={onBack} style={nextButton}>⬅ Back</button>

      <h2>🐾 Animal Sound Game - Trò chơi Tiếng kêu Động vật</h2>

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

      <button disabled={disableUI} onClick={playSound} style={{
    ...speakButton,
    opacity: disableUI ? 0.5 : 1
  }}>
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
			disabled={isLocked}
            onClick={() => handleClick(animal)}
            style={emojiButton}
          >
            {animal.emoji}
          </button>
        ))}
      </div>

      <button disabled={disableUI} onClick={speakQuestion}  style={{
    ...speakButton,
    opacity: disableUI ? 0.5 : 1
  }}>
        🔊 Hear Question
      </button>

      <button disabled={isLocked || isSpeaking} onClick={nextRound} style={{
    ...nextButton,
    opacity: disableUI ? 0.5 : 1
  }}>
        ➡️ Next
      </button>
    </>
  )
}
