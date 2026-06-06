import { useEffect, useState } from 'react'
import { playCorrect, playWrong } from '../utils/sounds'
import { nextButton, speakButton, emojiButton } from '../utils/gameStyles'
import { useGameLock } from '../utils/useGameLock'
import { useLanguage } from '../context/LanguageContext'
import { speakLocalized } from '../utils/speakLocalized'
import { playGameAudio } from '../utils/playGameAudio'

const easyItems = [
  { emoji: '🐶', name: 'DOG', vi: 'CHÓ', zh: '狗', soundFile: 'dog.mp3' },
  { emoji: '🐱', name: 'CAT', vi: 'MÈO', zh: '猫', soundFile: 'cat.mp3' },
  { emoji: '🐮', name: 'COW', vi: 'BÒ', zh: '牛', soundFile: 'cow.mp3' },
  { emoji: '🐔', name: 'CHICKEN', vi: 'GÀ', zh: '鸡', soundFile: 'chicken.mp3' },
  { emoji: '🐴', name: 'HORSE', vi: 'NGỰA', zh: '马', soundFile: 'horse.mp3' },
]

const mediumItems = [
  ...easyItems,
  { emoji: '🐷', name: 'PIG', vi: 'HEO', zh: '猪', soundFile: 'pig.mp3' },
  { emoji: '🐑', name: 'SHEEP', vi: 'CỪU', zh: '羊', soundFile: 'sheep.mp3' },
]

const hardItems = [
  ...mediumItems,
  { emoji: '🦆', name: 'DUCK', vi: 'VỊT', zh: '鸭子', soundFile: 'duck.mp3' },
  { emoji: '🐸', name: 'FROG', vi: 'ẾCH', zh: '青蛙', soundFile: 'frog.mp3' },
]

const titles = {
  en: '🐾 Animal Sound Game',
  vi: '🐾 Trò chơi Tiếng kêu Động vật',
  zh: '🐾 动物叫声游戏',
  'en-vi': '🐾 Animal Sound Game — Trò chơi Tiếng kêu Động vật',
  'en-zh': '🐾 Animal Sound Game — 动物叫声游戏',
}

const uiText = {

  back: {
    en: '⬅ Back',
    vi: '⬅ Quay lại',
    zh: '⬅ 返回',
    'en-vi': '⬅ Back / Quay lại',
    'en-zh': '⬅ Back / 返回',
  },

  playSound: {
    en: '🔊 Play Sound',
    vi: '🔊 Phát âm thanh',
    zh: '🔊 播放声音',
    'en-vi': '🔊 Play Sound / Phát âm thanh',
    'en-zh': '🔊 Play Sound / 播放声音',
  },

  hearQuestion: {
    en: '🔊 Hear Question',
    vi: '🔊 Nghe câu hỏi',
    zh: '🔊 听问题',
    'en-vi': '🔊 Hear Question / Nghe câu hỏi',
    'en-zh': '🔊 Hear Question / 听问题',
  },

  next: {
    en: '➡️ Next',
    vi: '➡️ Tiếp theo',
    zh: '➡️ 下一题',
    'en-vi': '➡️ Next / Tiếp theo',
    'en-zh': '➡️ Next / 下一题',
  },

  instruction: {
    en: 'Listen to the sound and choose the correct animal:',
    vi: 'Nghe âm thanh và chọn đúng con vật:',
    zh: '听声音并选择正确的动物：',
    'en-vi': 'Listen to the sound and choose the correct animal: / Nghe âm thanh và chọn đúng con vật:',
    'en-zh': 'Listen to the sound and choose the correct animal: / 听声音并选择正确的动物：',
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

export default function AnimalSoundGame({
  onBack,
  addStar,
  difficulty,
  completeGame,
  resetRef,
}) {
  const animals =
    difficulty === 'easy'
      ? easyItems
      : difficulty === 'medium'
      ? mediumItems
      : hardItems

  const [target, setTarget] = useState(animals[0])
  const [choices, setChoices] = useState([])
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showCelebrate, setShowCelebrate] = useState(false)

  const { isLocked, setIsLocked, disableUI, isSpeaking, setIsSpeaking } = useGameLock()
  const { languageMode } = useLanguage()

  useEffect(() => {
    nextRound()
  }, [difficulty])

  const nextRound = () => {
    if (disableUI) return

    const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
    setTarget(randomAnimal)

    const choiceCount =
      difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7

    let wrongChoices = animals
      .filter((a) => a.name !== randomAnimal.name)
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
      speech: ['Which animal makes this sound?'],
      vietnamese: ['Con vật nào tạo ra âm thanh này?'],
      chinese: ['这是什么动物的叫声？'],
      soundFile: target.soundFile,
      setIsSpeaking,
    })
  }

  const praises = {
    en: ['Great job!', 'Amazing!', 'Wonderful!', 'Awesome!', 'Yay!'],
    vi: ['Làm tốt lắm!', 'Tuyệt vời!', 'Xuất sắc!', 'Hay quá!', 'Yeah!'],
    zh: ['太棒了！', '太精彩了！', '干得好！', '厉害！', '耶！'],
  }

  const randomPraise = (lang) => {
    const arr = praises[lang]
    return arr[Math.floor(Math.random() * arr.length)]
  }

  const handleClick = async (animal) => {
    if (disableUI || isLocked) return

    if (animal.name === target.name) {
      playCorrect()
      setIsLocked(true)

      if (streak === 2) speakLocalized({ text: uiText.streakSpeech.streak2, languageMode })
      if (streak === 4) speakLocalized({ text: uiText.streakSpeech.streak4, languageMode })
      if (streak === 9) speakLocalized({ text: uiText.streakSpeech.streak9, languageMode })

      addStar()
      const newScore = score + 1
      setScore(newScore)
      setStreak((prev) => prev + 1)

      if (newScore >= 5) completeGame('animalsound')

      setShowCelebrate(true)

      const praiseLang =
        languageMode === 'vi' || languageMode === 'en-vi'
          ? 'vi'
          : languageMode === 'zh' || languageMode === 'en-zh'
          ? 'zh'
          : 'en'

      await speakLocalized({
        text: {
          en: `${randomPraise('en')} ${animal.name}!`,
          vi: `${randomPraise('vi')} ${animal.vi}!`,
          zh: `${randomPraise('zh')} ${animal.zh}!`,
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
          en: 'Try again!',
          vi: 'Thử lại nhé!',
          zh: '再试一次！',
        },
        languageMode,
      })

      setTimeout(() => setIsLocked(false), 1200)
    }
  }

  useEffect(() => {
    if (resetRef) resetRef.current = resetAnimalSoundGame
  }, [])

  const resetAnimalSoundGame = () => {
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
        <div style={{ fontSize: 32, marginBottom: 20, color: '#ff4757', animation: 'pop .5s ease' }}>
          {uiText.streakMessage[languageMode]}
        </div>
      )}

      {showCelebrate && (
        <div style={{ fontSize: 60, marginTop: 20, animation: 'pop .6s ease' }}>
          🎉 ⭐ 🌟
        </div>
      )}

     <p style={{ fontSize: 22, marginTop: 20 }}>
  {uiText.instruction[languageMode]}
</p>


      <button disabled={disableUI} onClick={playSound} style={{ ...speakButton, opacity: disableUI ? 0.5 : 1 }}>
  {uiText.playSound[languageMode]}
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

     <button disabled={disableUI} onClick={speakQuestion} style={{ ...speakButton, opacity: disableUI ? 0.5 : 1 }}>
  {uiText.hearQuestion[languageMode]}
</button>


      <button disabled={disableUI} onClick={nextRound} style={{ ...nextButton, opacity: disableUI ? 0.5 : 1 }}>
  {uiText.next[languageMode]}
</button>

    </>
  )
}
