import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyItems = [
  { emoji: '🔴', translations: { en: 'RED', vi: 'ĐỎ', zh: '红色' }, color: '#ff4d4d' },
  { emoji: '🔵', translations: { en: 'BLUE', vi: 'XANH DƯƠNG', zh: '蓝色' }, color: '#4d7cff' },
  { emoji: '🟢', translations: { en: 'GREEN', vi: 'XANH LÁ', zh: '绿色' }, color: '#4caf50' },
  { emoji: '🟡', translations: { en: 'YELLOW', vi: 'VÀNG', zh: '黄色' }, color: '#ffd60a' },
]

const mediumItems = [
  ...easyItems,
  { emoji: '🟠', translations: { en: 'ORANGE', vi: 'CAM', zh: '橙色' }, color: '#ff8c42' },
  { emoji: '🟣', translations: { en: 'PURPLE', vi: 'TÍM', zh: '紫色' }, color: '#9b59b6' },
]

const hardItems = [
  ...mediumItems,
  { emoji: '🩷', translations: { en: 'PINK', vi: 'HỒNG', zh: '粉色' }, color: '#ff6fb5' },
  { emoji: '🟤', translations: { en: 'BROWN', vi: 'NÂU', zh: '棕色' }, color: '#8d6e63' },
]

const titles = {
  en: '🎨 Find the Color!',
  vi: '🎨 Tìm màu!',
  zh: '🎨 找到颜色！',
  'en-vi': '🎨 Find the Color! Tìm màu!',
  'en-zh': '🎨 Find the Color! 找到颜色！',
}

const uiText = {
  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回',
  },
  hearQuestion: {
    en: '🔊 Hear the Question',
    vi: '🔊 Nghe câu hỏi',
    zh: '🔊 听问题',
    'en-vi': '🔊 Hear the Question / Nghe câu hỏi',
    'en-zh': '🔊 Hear the Question / 听问题',
  },
  nextQuestion: {
    en: '➡️ Next Question',
    vi: '➡️ Câu tiếp theo',
    zh: '➡️ 下一题',
    'en-vi': '➡️ Next Question / Câu tiếp theo',
    'en-zh': '➡️ Next Question / 下一题',
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

export default function ColorGame({
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

  const [target, setTarget] = useState(items[0])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const { isLocked, setIsLocked, disableUI } = useGameLock()
  const { languageMode } = useLanguage()

  useEffect(() => {
    nextRound()
  }, [difficulty])

  const nextRound = () => {
    if (disableUI) return

    let randomItem = items[Math.floor(Math.random() * items.length)]
    while (randomItem.translations.en === target.translations.en) {
      randomItem = items[Math.floor(Math.random() * items.length)]
    }
    setTarget(randomItem)
  }

  const speakQuestion = async () => {
    if (disableUI) return

    await speakLocalized({
      text: {
        en: `Can you find ${target.translations.en}?`,
        vi: `Bạn có thể tìm thấy ${target.translations.vi} không?`,
        zh: `你能找到${target.translations.zh}吗？`,
      },
      languageMode,
    })
  }

  const praises = {
    en: ['Amazing!', 'Wonderful!', 'Great job!', 'Awesome!', 'Yay!'],
    vi: ['Tuyệt vời!', 'Giỏi lắm!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  }

  const randomPraise = (lang) => {
    const arr = praises[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const handleClick = async (item) => {
    if (disableUI) return

    if (item.translations.en === target.translations.en) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      setStreak((prev) => prev + 1)

      const newScore = score + 1
      setScore(newScore)
      if (newScore >= 5) completeGame('color')

      setShowCelebrate(true)

      await speakLocalized({
        text: {
          en: `${randomPraise('en')} ${target.translations.en}!`,
          vi: `${randomPraise('vi')} ${target.translations.vi}!`,
          zh: `${randomPraise('zh')} ${target.translations.zh}!`,
        },
        languageMode,
      })

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
        setIsLocked(false)
      }, 3000)
    } else {
      playWrong()
      setIsLocked(true)
      setStreak(0)

      await speakLocalized({
        text: {
          en: `Try again! ${target.translations.en}`,
          vi: `Thử lại nhé! ${target.translations.vi}`,
          zh: `再试一次！${target.translations.zh}`,
        },
        languageMode,
      })

      setTimeout(() => setIsLocked(false), 2000)
    }
  }

  const getDisplayedQuestion = () => {
    switch (languageMode) {
      case 'en':
        return `Can you find ${target.translations.en}?`
      case 'vi':
        return `Bạn có thể tìm thấy ${target.translations.vi} không?`
      case 'zh':
        return `你能找到${target.translations.zh}吗？`
      case 'en-vi':
        return `Can you find ${target.translations.en}? — Bạn có thể tìm thấy ${target.translations.vi} không?`
      case 'en-zh':
        return `Can you find ${target.translations.en}? — 你能找到${target.translations.zh}吗？`
      default:
        return ''
    }
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetColorGameState
  }, [])

  const resetColorGameState = () => {
    setScore(0)
    setStreak(0)
    setShowCelebrate(false)
    setIsLocked(false)
    nextRound()
  }

  return (
    <>
      <button onClick={onBack} style={nextButton}>
        {uiText.back[languageMode]}
      </button>

      <h2>{titles[languageMode]}</h2>

      <h2 style={{ color: '#ff7b00', marginTop: 10 }}>
        {uiText.score[languageMode]}: {score}
      </h2>

      <h3>{uiText.streak[languageMode]}: {streak}</h3>

      {streak >= 3 && (
        <div style={{ fontSize: 32, marginBottom: 20, color: '#ff4757', animation: 'pop 0.5s ease' }}>
          {uiText.streakMessage[languageMode]}
        </div>
      )}

      {showCelebrate && (
        <div style={{ fontSize: 60, marginTop: 20, animation: 'pop 0.6s ease' }}>
          🎉 ⭐ 🌟
        </div>
      )}

      <p>{getDisplayedQuestion()}</p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 30,
          marginTop: 40,
          flexWrap: 'wrap',
        }}
      >
        {items.map((item) => (
          <button
            key={item.translations.en}
            disabled={isLocked}
            onClick={() => handleClick(item)}
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: item.color,
            }}
          />
        ))}
      </div>

      <button
        disabled={disableUI}
        onClick={speakQuestion}
        style={{ ...speakButton, opacity: disableUI ? 0.5 : 1 }}
      >
        {uiText.hearQuestion[languageMode]}
      </button>

      <button
        disabled={disableUI}
        onClick={nextRound}
        style={{ ...nextButton, opacity: disableUI ? 0.5 : 1 }}
      >
        {uiText.nextQuestion[languageMode]}
      </button>
    </>
  )
}
