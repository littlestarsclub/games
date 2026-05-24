import { useEffect, useState } from 'react'
import { speak } from '../utils/speak'
import { playCorrect, playWrong,} from '../utils/sounds'
import { emojiButton, nextButton, speakButton, } from '../utils/gameStyles'

const vehicles = [
  {
    emoji: '🚗',
    name: 'CAR',
    vietnamese: 'XE HƠI',
	soundFile: 'car.mp3',
  },
  {
    emoji: '✈️',
    name: 'AIRPLANE',
    vietnamese: 'MÁY BAY',
	soundFile: 'airplane.mp3',
	
  },
  {
    emoji: '🚌',
    name: 'BUS',
    vietnamese: 'XE BUÝT',
	soundFile: 'bus.mp3',
  },
]

export default function VehicleGame({
  onBack,
  addStar,
}: {
  onBack: () => void
  addStar: () => void
}) {
	const [target, setTarget] = useState(vehicles[0])
	const [score, setScore] = useState(0)
	const [showCelebrate, setShowCelebrate] = useState(false)

	useEffect(() => { nextRound() }, [])

	const nextRound = () => {
		const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
		setTarget(randomVehicle)
	}

	const speakQuestion = async () => {
		await speak(`Can you find ${target.name}?`)
		await speak(target.vietnamese, 'vi-VN')
	}
	/*const speakQuestion = () => {
		speak(`Can you find ${target.name}?`)
		setTimeout(() => {
			speak(target.vietnamese, 'vi-VN')
		}, 1000)
	}*/

	const praises = ['Amazing!', 'Wonderful!', 'Great job!', 'Awesome!', 'Yay!',]

	const randomPraise = () => {
		return praises[Math.floor(Math.random() * praises.length)]
	}
	
	const handleClick = (vehicle: typeof vehicles[0]) => {
		if (vehicle.name === target.name) {
			playCorrect()
	 
			new Audio(`/sounds/${vehicle.soundFile}`).play()
			addStar()

			setScore((prev) => prev + 1)
			setShowCelebrate(true)
			speak(`${randomPraise()} ${vehicle.name}!`)

			setTimeout(() => {
				speak(vehicle.vietnamese, 'vi-VN') }, 1000)

			setTimeout(() => {
				setShowCelebrate(false)
				nextRound()
			}, 2000)
		} else { speak('Try again!')}
	}
	
	return (
		<>
		<button onClick={onBack} style={nextButton} >
			⬅ Back
		</button>
		<h2>🚗 Find the Vehicle!</h2>
		<h2 style={{ color: '#ff7b00', marginTop: 10, }} >
		⭐ Score: {score}
		</h2>
		{showCelebrate && (
			<div style={{
				fontSize: 60,
				marginTop: 20,
				animation: 'pop 0.6s ease',
				}}
			>
			🎉 ⭐ 🌟
			</div>
		)}
		
		<p>Can you find {target.name}?</p>
		<p>{target.vietnamese}</p>
		<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, 	marginTop: 30, }}>
			{vehicles.map((vehicle) => (
				<button
					key={vehicle.name}
					onClick={() => handleClick(vehicle)}
					style={vehicleButton}
				>
				{vehicle.emoji}
				</button>
			))}
		</div>
			<button onClick={speakQuestion} style={speakButton} >
				🔊 Hear the Question
			</button>
			<button onClick={nextRound} style={nextButton} >
				➡️ Next Vehicle
			</button>
		</>
	)
}

const vehicleButton = {
  fontSize: 90,
  border: 'none',
  borderRadius: 24,
  padding: 30,
  cursor: 'pointer',
  background: '#d9f4ff',
}

