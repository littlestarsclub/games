import { useEffect, useState } from 'react'
import { nextButton } from '../utils/gameStyles'
import { playCorrect, playWrong } from '../utils/sounds'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyItems = [
  { emoji: '🎈', name: 'up', vi: 'lên', zh: '上' },
  { emoji: '🪁', name: 'up', vi: 'lên', zh: '上' },
  { emoji: '🚀', name: 'up', vi: 'lên', zh: '上' },

  { emoji: '⬇️', name: 'down', vi: 'xuống', zh: '下' },
  { emoji: '⚓', name: 'down', vi: 'xuống', zh: '下' },
  { emoji: '🪨', name: 'down', vi: 'xuống', zh: '下' },
]

const mediumItems = [
  ...easyItems,
  { emoji: '🕊️', name: 'up', vi: 'lên', zh: '上' },
  { emoji: '🌤️', name: 'up', vi: 'lên', zh: '上' },

  { emoji: '🌧️', name: 'down', vi: 'xuống', zh: '下' },
  { emoji: '🍂', name: 'down', vi: 'xuống', zh: '下' },
]

const hardItems = [
  ...mediumItems,
  { emoji: '📈', name: 'up', vi: 'lên', zh: '上' },
  { emoji: '🎵', name: 'up', vi: 'lên', zh: '上' },

  { emoji: '📉', name: 'down', vi: 'xuống', zh: '下' },
  { emoji: '🥀', name: 'down', vi: 'xuống', zh: '下' },
]

const titles = {
  en: '⬆️⬇️ Up or Down',
  vi: '⬆️⬇️ Lên hay Xuống',
  zh: '⬆️⬇️ 上还是下',
  'en-vi': '⬆️⬇️ Up or Down — Lên hay Xuống',
  'en-zh': '⬆️⬇️ Up or Down — 上还是下',
}

const uiText = {
  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回',
  },

  instruction: {
    en: 'Is it UP or DOWN?',
    vi: 'Là LÊN hay XUỐNG?',
    zh: '这是向上还是向下？',
    'en-vi': 'Is it UP or DOWN? / Là LÊN hay XUỐNG?',
    'en-zh': 'Is it UP or DOWN? / 这是向上还是向下？',
  },

  up: {
    en: '⬆️ UP',
    vi: '⬆️ LÊN',
    zh: '⬆️ 上',
    'en-vi': '⬆️ UP / LÊN',
    'en-zh': '⬆️ UP / 上',
  },

  down: {
    en: '⬇️ DOWN',
    vi: '⬇️ XUỐNG',
    zh: '⬇️ 下',
    'en-vi': '⬇️ DOWN / XUỐNG',
    'en-zh': '⬇️ DOWN / 下',
  },

  score: {
    en: '⭐ Score',
    vi: '⭐ Điểm',
    zh: '⭐ 分数',
    'en-vi': '⭐ Score / Điểm',
    'en-zh': '⭐ Score / 分数',
  },

  streak: {
    en: '🔥 Streak',
    vi: '🔥 Chuỗi đúng',
    zh: '🔥 连续答对',
    'en-vi': '🔥 Streak / Chuỗi đúng',
    'en-zh': '🔥 Streak / 连续答对',
  },

  streakMessage: {
    en: '🔥 Amazing Streak!',
    vi: '🔥 Chuỗi đúng tuyệt vời!',
    zh: '🔥 惊人的连胜！',
    'en-vi': '🔥 Amazing Streak! / Chuỗi đúng tuyệt vời!',
    'en-zh': '🔥 Amazing Streak! / 惊人的连胜！',
  },

  streakSpeech: {
    streak2: { en: 'Amazing streak!', vi: 'Chuỗi đúng tuyệt vời!', zh: '惊人的连胜！' },
    streak4: { en: 'Super learner!', vi: 'Siêu học sinh!', zh: '超级学习者！' },
    streak9: { en: 'WOW! Superstar!', vi: 'WOW! Siêu sao!', zh: '哇！超级明星！' },
  },
}


export default function UpDownGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
  resetRef,
}) {
  const items =
    difficulty === 'easy'
      ? easyItems
      : difficulty === 'medium'
      ? mediumItems
      : hardItems

  const [item, setItem] = useState(items[0])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const { isLocked, setIsLocked, disableUI } = useGameLock()
  const { languageMode } = useLanguage()

  const praises = {
    en: ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!'],
    vi: ['Làm tốt lắm!', 'Tuyệt vời!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  }

  const randomPraise = (lang) => {
    const arr = praises[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const nextRound = () => {
    setItem(items[Math.floor(Math.random() * items.length)])
  }

  useEffect(() => {
    speakLocalized({
      text: {
        en: 'Is it up or down?',
        vi: 'Là lên hay xuống?',
        zh: '这是上还是下？',
      },
      languageMode,
    })
  }, [item])

  const handleAnswer = async (answer: string) => {
    if (isLocked || disableUI) return

    if (answer === item.name) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      setStreak((prev) => prev + 1)
      const newScore = score + 1
      setScore(newScore)

      if (newScore >= 5) completeGame('updown')

      setShowCelebrate(true)

      const praiseLang =
        languageMode === 'vi' || languageMode === 'en-vi'
          ? 'vi'
          : languageMode === 'zh' || languageMode === 'en-zh'
          ? 'zh'
          : 'en'

      await speakLocalized({
        text: {
          en: `${randomPraise('en')} ${item.name}!`,
          vi: `${randomPraise('vi')} ${item.vi}!`,
          zh: `${randomPraise('zh')} ${item.zh}!`,
        },
        languageMode,
      })

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
        setIsLocked(false)
      }, 2000)
    } else {
      playWrong()
      setIsLocked(true)
      setStreak(0)

      await speakLocalized({
        text: {
          en: 'Oops! Try again!',
          vi: 'Ối! Thử lại nhé!',
          zh: '再试一次！',
        },
        languageMode,
      })

      setTimeout(() => setIsLocked(false), 1200)
    }
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetUpDownGame
  }, [])

  const resetUpDownGame = () => {
    setScore(0)
    setStreak(0)
    setShowCelebrate(false)
    setIsLocked(false)
    nextRound()
  }

  return (
    <div>
      <button onClick={onBack} style={nextButton}>
        {uiText.back[languageMode]}
      </button>

      <h2>{titles[languageMode]}</h2>

      <h3 style={{ color: '#ff7b00' }}>
        {uiText.score[languageMode]}: {score}
      </h3>

      <h3>{uiText.streak[languageMode]}: {streak}</h3>

      {streak >= 3 && (
        <div style={{ fontSize: 32, marginBottom: 20, color: '#ff4757', animation: 'pop .5s ease' }}>
          {uiText.streakMessage[languageMode]}
        </div>
      )}

      {showCelebrate && (
        <div style={{ fontSize: 60, marginTop: 20, animation: 'pop .5s ease' }}>
          🎉⬆️✨
        </div>
      )}

     <p style={{ fontSize: 28, marginBottom: 30, color: '#555' }}>
  {uiText.instruction[languageMode]}
</p>


      <div
        style={{
          fontSize: 140,
          marginTop: 30,
          marginBottom: 30,
          animation:
            item.name === 'up'
              ? 'float 1s ease-in-out infinite'
              : 'float 2.5s ease-in-out infinite',
        }}
      >
        {item.emoji}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <button
          disabled={isLocked}
          onClick={() => handleAnswer('up')}
          style={{
            fontSize: 28,
            padding: '20px 40px',
            borderRadius: 24,
            border: 'none',
            background: '#55efc4',
            cursor: 'pointer',
          }}
        >
          {uiText.up[languageMode]}
        </button>

        <button
          disabled={isLocked}
          onClick={() => handleAnswer('down')}
          style={{
            fontSize: 28,
            padding: '20px 40px',
            borderRadius: 24,
            border: 'none',
            background: '#74b9ff',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {uiText.down[languageMode]}
        </button>
      </div>
    </div>
  )
}
