import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, emojiButton } from '../utils/gameStyles'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

const easyItems = [
  { emoji: '🦁', en: 'LION', vi: 'SƯ TỬ', zh: '狮子' },
  { emoji: '🐯', en: 'TIGER', vi: 'HỔ', zh: '老虎' },
  { emoji: '🐵', en: 'MONKEY', vi: 'KHỈ', zh: '猴子' },
  { emoji: '🐘', en: 'ELEPHANT', vi: 'VOI', zh: '大象' },
]

const mediumItems = [
  ...easyItems,
  { emoji: '🦒', en: 'GIRAFFE', vi: 'HƯƠU CAO CỔ', zh: '长颈鹿' },
  { emoji: '🦓', en: 'ZEBRA', vi: 'NGỰA VẰN', zh: '斑马' },
]

const hardItems = [
  ...mediumItems,
  { emoji: '🐼', en: 'PANDA', vi: 'GẤU TRÚC', zh: '熊猫' },
  { emoji: '🦘', en: 'KANGAROO', vi: 'CHUỘT TÚI', zh: '袋鼠' },
]

const titles = {
  en: '🧠 Zoo Memory Match',
  vi: '🧠 Trò chơi Trí nhớ Động vật',
  zh: '🧠 动物记忆配对游戏',
  'en-vi': '🧠 Zoo Memory Match — Trò chơi Trí nhớ Động vật',
  'en-zh': '🧠 Zoo Memory Match — 动物记忆配对游戏',
}

const uiText = {
  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回',
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
  restart: {
    en: '🔄 Restart',
    vi: '🔄 Chơi lại',
    zh: '🔄 重新开始',
    'en-vi': '🔄 Restart / Chơi lại',
    'en-zh': '🔄 Restart / 重新开始',
  },
}

export default function ZooMemoryGame({
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

  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const { languageMode } = useLanguage()

  useEffect(() => {
    startGame()
  }, [difficulty])

  const startGame = () => {
    const duplicated = [...items, ...items]

    const shuffled = duplicated
      .map((item) => ({ ...item, id: Math.random() }))
      .sort(() => Math.random() - 0.5)

    setCards(shuffled)
    setFlipped([])
    setMatched([])
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

  const handleFlip = async (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [i1, i2] = newFlipped
      const card1 = cards[i1]
      const card2 = cards[i2]

      if (card1.en === card2.en) {
        playCorrect()

        if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
        if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
        if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

        addStar()
        const newScore = score + 1
        setScore(newScore)
        setStreak((prev) => prev + 1)

        if (newScore >= 5) completeGame('memory')

        setMatched((prev) => [...prev, i1, i2])
        setShowCelebrate(true)

        await speakLocalized({
          text: {
            en: `${randomPraise('en')} ${card1.en}!`,
            vi: `${randomPraise('vi')} ${card1.vi}!`,
            zh: `${randomPraise('zh')} ${card1.zh}!`,
          },
          languageMode,
        })

        setTimeout(() => setShowCelebrate(false), 1200)
      } else {
        playWrong()
        setStreak(0)

        await speakLocalized({
          text: {
            en: 'Try again!',
            vi: 'Thử lại nhé!',
            zh: '再试一次！',
          },
          languageMode,
        })
      }

      setTimeout(() => setFlipped([]), 900)
    }
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetMemoryGame
  }, [])

  const resetMemoryGame = () => {
    setScore(0)
    setStreak(0)
    setShowCelebrate(false)
    startGame()
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
        <div style={{ fontSize: 32, marginBottom: 20, color: '#ff4757', animation: 'pop .5s ease' }}>
          {uiText.streakMessage[languageMode]}
        </div>
      )}

      {showCelebrate && (
        <div style={{ fontSize: 60, marginTop: 10 }}>
          🎉🐾⭐
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 80px)',
          gap: 15,
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index)

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(index)}
              style={{
                ...emojiButton,
                width: 80,
                height: 80,
                fontSize: isFlipped ? 40 : 0,
                background: isFlipped ? '#fff' : '#d0e7ff',
                transition: '0.3s',
              }}
            >
              {isFlipped ? card.emoji : '❓'}
            </button>
          )
        })}
      </div>

      <button onClick={startGame} style={nextButton}>
        {uiText.restart[languageMode]}
      </button>
    </>
  )
}
