import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'

export default function BalloonPopNumberGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
  resetRef,
}) {
  const { isLocked, setIsLocked, disableUI } = useGameLock()
  const { languageMode } = useLanguage()

  const [target, setTarget] = useState(1)
  const [choices, setChoices] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const titles = {
    en: '🎈 Balloon Pop Numbers',
    vi: '🎈 Bắn bóng số',
    zh: '🎈 气球数字游戏',
    'en-vi': '🎈 Balloon Pop Numbers — Bắn bóng số',
    'en-zh': '🎈 Balloon Pop Numbers — 气球数字游戏',
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
      en: '🔊 Hear Number',
      vi: '🔊 Nghe số',
      zh: '🔊 听数字',
      'en-vi': '🔊 Hear Number / Nghe số',
      'en-zh': '🔊 Hear Number / 听数字',
    },
    nextQuestion: {
      en: '➡️ Next',
      vi: '➡️ Tiếp theo',
      zh: '➡️ 下一题',
      'en-vi': '➡️ Next / Tiếp theo',
      'en-zh': '➡️ Next / 下一题',
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

  const praises = {
    en: ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!'],
    vi: ['Giỏi lắm!', 'Tuyệt vời!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  }

  const randomPraise = (lang) => {
    const arr = praises[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const getMaxNumber = () => {
    if (difficulty === 'easy') return 5
    if (difficulty === 'medium') return 10
    return 20
  }

  const getBalloonCount = () => {
    if (difficulty === 'easy') return 4
    if (difficulty === 'medium') return 6
    return 8
  }

  useEffect(() => {
    nextRound()
  }, [difficulty])

  const nextRound = () => {
    if (disableUI) return

    const max = getMaxNumber()
    const answer = Math.floor(Math.random() * max) + 1
    const count = getBalloonCount()

    const set = new Set<number>()
    set.add(answer)

    while (set.size < count) {
      set.add(Math.floor(Math.random() * max) + 1)
    }

    const shuffled = Array.from(set).sort(() => Math.random() - 0.5)

    setTarget(answer)
    setChoices(shuffled)
  }

  const speakQuestion = async () => {
    if (disableUI) return

    await speakLocalized({
      text: {
        en: `Pop number ${target}!`,
        vi: `Chạm số ${target}!`,
        zh: `戳破数字 ${target}！`,
      },
      languageMode,
    })
  }

  const handleClick = async (num: number) => {
    if (disableUI) return

    if (num === target) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      setScore((prev) => prev + 1)
      setStreak((prev) => prev + 1)
      setShowCelebrate(true)

      const praiseLang =
        languageMode === 'vi' || languageMode === 'en-vi'
          ? 'vi'
          : languageMode === 'zh' || languageMode === 'en-zh'
          ? 'zh'
          : 'en'

      await speakLocalized({
        text: {
          en: `${randomPraise('en')} ${num}!`,
          vi: `${randomPraise('vi')} ${num}!`,
          zh: `${randomPraise('zh')} ${num}!`,
        },
        languageMode,
      })

      const newScore = score + 1
      if (newScore >= 5) completeGame('balloonPop')

      setTimeout(() => {
        setShowCelebrate(false)
        nextRound()
        setIsLocked(false)
      }, 1500)
    } else {
      playWrong()
      setIsLocked(true)
      setStreak(0)

      await speakLocalized({
        text: {
          en: 'Try again!',
          vi: 'Thử lại nhé!',
          zh: '再试一次！',
        },
        languageMode,
      })

      setTimeout(() => setIsLocked(false), 1000)
    }
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetBalloonGame
  }, [])

  const resetBalloonGame = () => {
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

      <h3 style={{ color: '#ff7b00', marginTop: 10 }}>
        {uiText.score[languageMode]}: {score}
      </h3>

      <h3>{uiText.streak[languageMode]}: {streak}</h3>

      {streak >= 3 && (
        <div style={{ fontSize: 32, marginBottom: 20, color: '#ff4757', animation: 'pop .5s ease' }}>
          {uiText.streakMessage[languageMode]}
        </div>
      )}

      {showCelebrate && (
        <div style={{ fontSize: 60, animation: 'pop .5s ease' }}>
          🎉✨🎈
        </div>
      )}

      <p style={{ fontSize: 22 }}>
        {languageMode.startsWith('en')
          ? 'Pop Number:'
          : languageMode.startsWith('vi')
          ? 'Chạm số:'
          : '戳破数字：'}{' '}
        <b>{target}</b>
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 20,
          marginTop: 40,
        }}
      >
        {choices.map((num, index) => (
          <button
            key={index}
            disabled={disableUI}
            onClick={() => handleClick(num)}
            style={{
              fontSize: 40,
              width: 100,
              height: 130,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              animation: `float ${1 + index * 0.2}s infinite ease-in-out`,
              background: '#ff8fab',
            }}
          >
            🎈
            <div>{num}</div>
          </button>
        ))}
      </div>

      <button
        disabled={disableUI}
        onClick={speakQuestion}
        style={{ ...nextButton, opacity: disableUI ? 0.5 : 1 }}
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
