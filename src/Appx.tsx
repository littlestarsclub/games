import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { speak } from './utils/speak'

import AppleGame from './games/AppleGame'
import CountGame from './games/CountGame'
import ColorGame from './games/ColorGame'
import AnimalGame from './games/AnimalGame'
import VehicleGame from './games/VehicleGame'
import ShapeGame from './games/ShapeGame'
import MemoryGame from './games/MemoryGame'
import AnimalSoundGame from './games/AnimalSoundGame'

type GameMode =
  | 'home'
  | 'apple'
  | 'count'
  | 'color'
  | 'animal'
  | 'vehicle'
  | 'shape'
  | 'memory'
  | 'animalSound'

export default function App() {
const [currentKid, setCurrentKid] = useState('Emma')
  const [gameMode, setGameMode] = useState<GameMode>('home')
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const [theme, setTheme] = useState('default')
  const [totalStars, setTotalStars] = useState(() => { 
	const savedStars = localStorage.getItem(`little-stars-total-${currentKid}` )
	return savedStars ? Number(savedStars) : 0 })
  const [musicOn, setMusicOn] = useState(false)
  const musicRef = useRef(new Audio('/music/happy.mp3') )
 

  useEffect(() => {
    localStorage.setItem(
      `little-stars-total-${currentKid}`,
      String(totalStars)
    )
  }, [totalStars])

  useEffect(() => {
    musicRef.current.loop = true
  }, [])

  const toggleMusic = () => {
    if (musicOn) {
      musicRef.current.pause()
    } else {
      musicRef.current.play()
    }

    setMusicOn(!musicOn)
  }

  const goHome = () => {
    setGameMode('home')
  }

  const getBadge = () => {
    if (totalStars >= 100)
      return '👑 Super Genius'

    if (totalStars >= 50)
      return '🚀 Learning Hero'

    if (totalStars >= 25)
      return '🌟 Smart Star'

    if (totalStars >= 10)
      return '⭐ Beginner'

    return '🐣 New Learner'
  }

  const unlockedGames = {
    apple: true,
    count: true,
    color: true,

    shape: totalStars >= 10,

    vehicle: totalStars >= 25,

    animal: totalStars >= 50,
  }

  const addStar = () => {
    setTotalStars((prev) => {
      const newTotal = prev + 1

      if (newTotal === 10) {
        speak(
          'You unlocked Beginner!'
        )
      }

      if (newTotal === 25) {
        speak(
          'You unlocked Smart Star!'
        )
      }

      if (newTotal === 50) {
        speak(
          'You unlocked Learning Hero!'
        )
      }

      return newTotal
    })
  }
  
const claimDailyReward = () => {
  if (rewardClaimed) return

  setTotalStars((prev) => prev + 5)

  speak('Daily reward unlocked!')

  setRewardClaimed(true)
}

const dailyChallenges = [
  '🐶 Find 5 animals!',
  '🎨 Find 5 colors!',
  '🍎 Find 5 fruits!',
  '🚗 Find 5 vehicles!',
  '⭐ Earn 10 stars!',
]

const today =  new Date().getDate()

const dailyChallenge =  dailyChallenges[ today % dailyChallenges.length ]

const getPetMood = () => {
  if (totalStars >= 100)
    return {
      emoji: '🦄',
      text: 'Super Unicorn!',
    }

  if (totalStars >= 50)
    return {
      emoji: '🐶',
      text: 'Happy Puppy!',
    }

  if (totalStars >= 25)
    return {
      emoji: '🐱',
      text: 'Playful Kitty!',
    }

  return {
    emoji: '🐣',
    text: 'Little Chick!',
  }
}
const pet = getPetMood()

const themes = {
  default:
    'linear-gradient(to bottom, #FFF6B7 0%, #FFD7EC 100%)',

  rainbow:
    'linear-gradient(to bottom, #ff9ff3, #feca57, #48dbfb)',

  night:
    'linear-gradient(to bottom, #2d3436, #000000)',

  cloud:
    'linear-gradient(to bottom, #dfe6e9, #ffffff)',
}

const stickers = [
  {
    emoji: '🐶',
    stars: 10,
  },

  {
    emoji: '🚗',
    stars: 25,
  },

  {
    emoji: '🦄',
    stars: 50,
  },

  {
    emoji: '🚀',
    stars: 100,
  },

  {
    emoji: '🌈',
    stars: 150,
  },
]
const kids = [
  'Emma',
  'Noah',
  'Mia',
]
  return (
    <>
      <style>
        {`
          @keyframes pop {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }

            50% {
              transform: scale(1.2);
              opacity: 1;
            }

            100% {
              transform: scale(1);
            }
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-20px);
            }

            100% {
              transform: translateY(0px);
            }
          }
        `}
      </style>

      <div
        style={{
          minHeight: '100vh',
          background:
            //'linear-gradient(to bottom, #FFF6B7 0%, #FFD7EC 100%)',
			themes[theme],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          fontFamily: 'Arial, sans-serif',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Floating Background */}
        <div style={floatingStar1}>⭐</div>
        <div style={floatingStar2}>☁️</div>
        <div style={floatingStar3}>🌈</div>
        <div style={floatingStar4}>✨</div>

        <div
          style={{
            background: 'white',
            borderRadius: 32,
            padding: 40,
            maxWidth: 1100,
            width: '100%',
            textAlign: 'center',
            boxShadow:
              '0 10px 30px rgba(0,0,0,0.15)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: 70 }}>
            🌟
          </div>

          <h1
            style={{
              fontSize: 42,
              marginBottom: 10,
              color: '#ff7b00',
            }}
          >
            Little Stars Club Games
          </h1>
<div
  style={{
    marginBottom: 20,
  }}
>
  <h2>👧 Choose Player</h2>

  <div
    style={{
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}
  >
    {kids.map((kid) => (
      <button
        key={kid}
        onClick={() =>
          setCurrentKid(kid)
        }
        style={{
          padding: '12px 20px',
          borderRadius: 18,
          border: 'none',
          cursor: 'pointer',

          background:
            currentKid === kid
              ? '#74b9ff'
              : '#dfe6e9',

          color:
            currentKid === kid
              ? 'white'
              : 'black',

          fontSize: 18,
        }}
      >
        {kid}
      </button>
    ))}
  </div>
</div>
          <h2
            style={{
              color: '#ffb703',
              marginBottom: 10,
            }}
          >
            ⭐ Total Stars: {totalStars}
          </h2>

          <h3
            style={{
              color: '#ff7b00',
              marginBottom: 20,
            }}
          >
            🏆 {getBadge()}
			
          </h3>
		  
		  <div
			style={{ background: '#fff4b8', padding: 20, borderRadius: 24, marginBottom: 20, fontSize: 22, fontWeight: 'bold', }} >
			🌞 Today's Challenge: <br />
			{dailyChallenge}
		</div>
		<div
			style={{ background: '#ffeaa7', padding: 24, borderRadius: 28, marginBottom: 20, }} >
			<h2>🎁 Daily Reward</h2>
			<button  onClick={claimDailyReward} disabled={rewardClaimed}
				style={{ fontSize: 60, border: 'none', background: 'transparent', cursor: rewardClaimed? 'not-allowed' : 'pointer', }}  >
				{rewardClaimed ? '✅' : '🎁'}
			</button>

  <p>
    {rewardClaimed
      ? 'Reward Claimed!'
      : 'Tap to get 5 stars!'}
  </p>
</div>
<div
  style={{
    background: '#dff9fb',
    padding: 24,
    borderRadius: 28,
    marginBottom: 20,
  }}
>
  <div
    style={{
      fontSize: 80,
    }}
  >
    {pet.emoji}
  </div>

  <h2>{pet.text}</h2>

  <p>
    Your learning buddy is cheering
    for you!
  </p>
</div>
<div
  style={{
    background: '#f8f9fa',
    padding: 24,
    borderRadius: 28,
    marginBottom: 20,
  }}
>
  <h2>🎨 Themes</h2>

  <div
    style={{
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}
  >
    <button
      onClick={() =>
        setTheme('default')
      }
    >
      🌟 Default
    </button>

    <button
      onClick={() =>
        setTheme('rainbow')
      }
    >
      🌈 Rainbow
    </button>

    <button
      onClick={() =>
        setTheme('night')
      }
    >
      🌙 Night
    </button>

    <button
      onClick={() =>
        setTheme('cloud')
      }
    >
      ☁️ Cloud
    </button>
  </div>
</div>
<div
  style={{
    background: '#fff9db',
    padding: 24,
    borderRadius: 28,
    marginBottom: 20,
  }}
>
  <h2>🧸 Sticker Collection</h2>

  <div
    style={{
      display: 'flex',
      gap: 16,
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: 20,
    }}
  >
    {stickers.map((sticker) => {
      const unlocked =
        totalStars >= sticker.stars

      return (
        <div
          key={sticker.emoji}
          style={{
            fontSize: 60,

            opacity: unlocked ? 1 : 0.25,

            background: 'white',

            borderRadius: 20,

            padding: 16,

            width: 100,
          }}
        >
          <div>{sticker.emoji}</div>

          <div
            style={{
              fontSize: 14,
              marginTop: 8,
            }}
          >
            {unlocked
              ? 'Unlocked!'
              : `${sticker.stars} ⭐`}
          </div>
        </div>
      )
    })}
  </div>
</div>
          <button
            onClick={toggleMusic}
            style={{
              background: '#6c5ce7',
              border: 'none',
              color: 'white',
              padding: '14px 22px',
              borderRadius: 18,
              cursor: 'pointer',
              marginBottom: 20,
              fontSize: 18,
              marginRight: 12,
            }}
          >
            {musicOn
              ? '🔊 Music ON'
              : '🔇 Music OFF'}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem(
                `little-stars-total-${currentKid}`
              )

              setTotalStars(0)
            }}
            style={{
              background: '#ff7675',
              border: 'none',
              color: 'white',
              padding: '14px 22px',
              borderRadius: 18,
              cursor: 'pointer',
              marginBottom: 20,
              fontSize: 18,
            }}
          >
            Reset Progress
          </button>

          <p
            style={{
              color: '#666',
              fontSize: 22,
              marginBottom: 30,
            }}
          >
            Learn English & Vietnamese
            the fun way!
          </p>

          {/* HOME SCREEN */}
          {gameMode === 'home' && (
            <>
			
			<h2
  style={{
    marginBottom: 20,
    color: '#ff7b00',
  }}
>
  🏡 Explore Worlds
</h2>

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 20,
    marginBottom: 40,
  }}
>

{worlds.map((world) => {
  const unlocked = totalStars >= world.stars
  return (
    <div
      key={world.title}
      style={{
        background: 'white',
        borderRadius: 28,
        padding: 24,

        boxShadow:
          '0 8px 20px rgba(0,0,0,0.12)',

        opacity: unlocked ? 1 : 0.45,

        border:
          unlocked
            ? '4px solid #7bed9f'
            : '4px solid #dfe4ea',
      }}
    >
  
      <div
        style={{
          fontSize: 70,
        }}
      >
        {world.emoji}
      </div>

      <h2>{world.title}</h2>

      <p>{world.text}</p>
	  <p
  style={{
    marginTop: 12,
    fontWeight: 'bold',
  }}
>
  {unlocked
    ? '✅ Unlocked!'
    : `🔒 ${world.stars} ⭐ Required`}
</p>
    </div>
	)
})}
  
</div>
			
			
              {/* Learning Games */}
              <h2
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  color: '#ff7b00',
                }}
              >
                🎓 Learning Games
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                }}
              >
                <GameCard
                  emoji="🍎"
                  title="Apple Game"
                  description="Find fun fruits!"
                  onClick={() =>
                    setGameMode('apple')
                  }
                />

                <GameCard
                  emoji="🎨"
                  title="Color Game"
                  description="Learn colors!"
                  onClick={() =>
                    setGameMode('color')
                  }
                />

                <GameCard
                  emoji="🔺"
                  title="Shape Game"
                  description="Learn shapes!"
                  locked={
                    !unlockedGames.shape
                  }
                  requiredStars={10}
                  onClick={() =>
                    setGameMode('shape')
                  }
                />
              </div>

              {/* Math Games */}
              <h2
                style={{
                  marginTop: 50,
                  marginBottom: 20,
                  color: '#ff7b00',
                }}
              >
                🔢 Math Games
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                }}
              >
                <GameCard
                  emoji="⭐"
                  title="Count Game"
                  description="Learn numbers!"
                  onClick={() =>
                    setGameMode('count')
                  }
                />
              </div>

              {/* Sound Games */}
              <h2
                style={{
                  marginTop: 50,
                  marginBottom: 20,
                  color: '#ff7b00',
                }}
              >
                🔊 Sound Games
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 20,
                }}
              >
                <GameCard
                  emoji="🐶"
                  title="Animal Sounds"
                  description="Hear Animal sounds!"
                  locked={
                    !unlockedGames.animal
                  }
                  requiredStars={50}
                  onClick={() =>
                    setGameMode('animalSound')
                  }
                />

                <GameCard
                  emoji="🚗"
                  title="Vehicle Game"
                  description="Find vehicles!"
                  locked={
                    !unlockedGames.vehicle
                  }
                  requiredStars={25}
                  onClick={() =>
                    setGameMode('vehicle')
                  }
                />
				<GameCard
					emoji="🧠"
					title="Memory Game"
					description="Match the cards!"
					onClick={() =>
					setGameMode('memory')
					}
				/>
              </div>
            </>
          )}

          {/* GAME SCREENS */}
          {gameMode === 'apple' && (
            <AppleGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'count' && (
            <CountGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'color' && (
            <ColorGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'animal' && (
            <AnimalGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'vehicle' && (
            <VehicleGame
              onBack={goHome}
              addStar={addStar}
            />
          )}

          {gameMode === 'shape' && (
            <ShapeGame
              onBack={goHome}
              addStar={addStar}
            />
          )}
		  
		  {gameMode === 'memory' && (
			<MemoryGame
				onBack={goHome}
				addStar={addStar}
			/>
		  )}
		  {gameMode === 'animalSound' && (
			<AnimalSoundGame
				onBack={goHome}
				addStar={addStar}
			/>
)}
          <div
            style={{
              marginTop: 40,
              fontSize: 18,
              color: '#777',
            }}
          >
            Little Stars Club | Bé Học Vui 🌟
          </div>
        </div>
      </div>
    </>
  )
}

const worlds = [
  {
    emoji: '🏫',
    title: 'Classroom',
    text: 'Learning Games',
    stars: 0,
  },

  {
    emoji: '🌳',
    title: 'Playground',
    text: 'Action Games',
    stars: 10,
  },

  {
    emoji: '🦁',
    title: 'Zoo',
    text: 'Animal Games',
    stars: 25,
  },

  {
    emoji: '🚀',
    title: 'Space Room',
    text: 'Math Games',
    stars: 50,
  },

  {
    emoji: '🐠',
    title: 'Ocean World',
    text: 'Sea Animals',
    stars: 75,
  },
]

function GameCard({
  emoji,
  title,
  description,
  onClick,
  locked,
  requiredStars,
}: {
  emoji: string
  title: string
  description: string
  onClick: () => void
  locked?: boolean
  requiredStars?: number
})

 {
  return (
    <button
      onClick={() => {
        if (!locked) {
          onClick()
        }
      }}
      style={{
        border: 'none',
        borderRadius: 28,
        padding: 24,
        background: 'white',
        boxShadow:
          '0 8px 20px rgba(0,0,0,0.12)',

        opacity: locked ? 0.5 : 1,

        cursor: locked
          ? 'not-allowed'
          : 'pointer',

        transition: '0.2s',
      }}
    >
      <div style={{ fontSize: 70 }}>
        {emoji}
      </div>

      <h2>{title}</h2>

      <p
        style={{
          color: '#666',
          fontSize: 18,
        }}
      >
        {description}
      </p>

      {locked && (
        <p
          style={{
            color: '#e63946',
            fontWeight: 'bold',
            marginTop: 10,
          }}
        >
          🔒 {requiredStars} ⭐ Required
        </p>
      )}
    </button>
  )
}

const floatingStar1 = {
  position: 'absolute' as const,
  top: '10%',
  left: '8%',
  fontSize: 50,
  animation: 'float 6s ease-in-out infinite',
}

const floatingStar2 = {
  position: 'absolute' as const,
  top: '20%',
  right: '10%',
  fontSize: 70,
  animation: 'float 8s ease-in-out infinite',
}

const floatingStar3 = {
  position: 'absolute' as const,
  bottom: '15%',
  left: '12%',
  fontSize: 60,
  animation: 'float 7s ease-in-out infinite',
}

const floatingStar4 = {
  position: 'absolute' as const,
  bottom: '12%',
  right: '8%',
  fontSize: 45,
  animation: 'float 5s ease-in-out infinite',
}