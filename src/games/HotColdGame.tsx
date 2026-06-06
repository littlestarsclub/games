import { useEffect, useState } from 'react'
import { nextButton } from '../utils/gameStyles'
import { playCorrect, playWrong } from '../utils/sounds'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyItems = [
  { emoji: '☀️', name: 'hot', vi: 'nóng', zh: '热' },
  { emoji: '🔥', name: 'hot', vi: 'nóng', zh: '热' },
  { emoji: '🌋', name: 'hot', vi: 'nóng', zh: '热' },

  { emoji: '❄️', name: 'cold', vi: 'lạnh', zh: '冷' },
  { emoji: '🧊', name: 'cold', vi: 'lạnh', zh: '冷' },
  { emoji: '☃️', name: 'cold', vi: 'lạnh', zh: '冷' },
]

const mediumItems = [
  ...easyItems,
  { emoji: '🍲', name: 'hot', vi: 'nóng', zh: '热' },
  { emoji: '🌶️', name: 'hot', vi: 'nóng', zh: '辣/热' },

  { emoji: '🍦', name: 'cold', vi: 'lạnh', zh: '冷' },
  { emoji: '🥶', name: 'cold', vi: 'lạnh', zh: '冷' },
]

const hardItems = [
  ...mediumItems,
  { emoji: '♨️', name: 'hot', vi: 'nóng', zh: '热' },
  { emoji: '🥵', name: 'hot', vi: 'nóng', zh: '热' },

  { emoji: '🌨️', name: 'cold', vi: 'lạnh', zh: '冷' },
  { emoji: '🧥', name: 'cold', vi: 'lạnh', zh: '冷' },
]

const titles = {
  en: '🔥❄️ Hot or Cold',
  vi: '🔥❄️ Nóng hay Lạnh',
  zh: '🔥❄️ 热还是冷',
  'en-vi': '🔥❄️ Hot or Cold — Nóng hay Lạnh',
  'en-zh': '🔥❄️ Hot or Cold — 热还是冷',
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
    en: 'Is it HOT or COLD?',
    vi: 'Là NÓNG hay LẠNH?',
    zh: '这是热的还是冷的？',
    'en-vi': 'Is it HOT or COLD? / Là NÓNG hay LẠNH?',
    'en-zh': 'Is it HOT or COLD? / 这是热的还是冷的？',
  },

  hot: {
    en: '🔥 HOT',
    vi: '🔥 NÓNG',
    zh: '🔥 热',
    'en-vi': '🔥 HOT / NÓNG',
    'en-zh': '🔥 HOT / 热',
  },

  cold: {
    en: '❄️ COLD',
    vi: '❄️ LẠNH',
    zh: '❄️ 冷',
    'en-vi': '❄️ COLD / LẠNH',
    'en-zh': '❄️ COLD / 冷',
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


export default function HotColdGame({
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
        en: 'Is it hot or cold?',
        vi: 'Là nóng hay lạnh?',
        zh: '这是热还是冷？',
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
      const newScore = score + 1
      setScore(newScore)
      setStreak((prev) => prev + 1)

      if (newScore >= 5) completeGame('hotcold')

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
    if (resetRef) resetRef.current = resetHotColdGame
  }, [])

  const resetHotColdGame = () => {
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
          🎉✨🔥
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
          animation: 'float 2s ease-in-out infinite',
        }}
      >
        {item.emoji}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
        <button
          disabled={isLocked}
          onClick={() => handleAnswer('hot')}
          style={{
            fontSize: 28,
            padding: '20px 40px',
            borderRadius: 24,
            border: 'none',
            background: '#ff7675',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          {uiText.hot[languageMode]}

        </button>

        <button
          disabled={isLocked}
          onClick={() => handleAnswer('cold')}
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
          {uiText.cold[languageMode]}
        </button>
      </div>
    </div>
  )
}
