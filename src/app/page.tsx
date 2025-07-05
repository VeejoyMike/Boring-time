'use client'

import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { Volume2, VolumeX, RotateCcw, Zap, Heart, Star, Circle, Lightbulb } from 'lucide-react'

export default function StressReliefApp() {
	const [score, setScore] = useState(0)
	const [soundEnabled, setSoundEnabled] = useState(true)
	const [bubbles, setBubbles] = useState<Array<{id: number, popped: boolean}>>([])
	const [lights, setLights] = useState<Array<{isOn: boolean, color: string}>>([])
	const [switches, setSwitches] = useState<Array<{isOn: boolean, color: string}>>([])
	const [sliderValue, setSliderValue] = useState(50)
	const [colorButtons, setColorButtons] = useState<Array<{color: string, clicked: boolean}>>([])
	const [clickedButtons, setClickedButtons] = useState<Set<number>>(new Set())
	const canvasRef = useRef<HTMLCanvasElement>(null)

	// 7 colors for random selection
	const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff']

	// Helper function to get random color
	const getRandomColor = (): string => {
		const randomIndex = Math.floor(Math.random() * colors.length)
		return colors[randomIndex] || '#ff6b6b' // fallback color
	}

	// Initialize bubble wrap
	useEffect(() => {
		const newBubbles = Array.from({length: 60}, (_, i) => ({
			id: i,
			popped: false
		}))
		setBubbles(newBubbles)

		// Initialize lights with random colors
		const newLights = Array.from({length: 12}, () => ({
			isOn: false,
			color: getRandomColor()
		}))
		setLights(newLights)

		// Initialize switches with random colors
		const newSwitches = Array.from({length: 8}, () => ({
			isOn: false,
			color: getRandomColor()
		}))
		setSwitches(newSwitches)

		// Initialize color buttons with random colors
		const newColorButtons = Array.from({length: 8}, () => ({
			color: getRandomColor(),
			clicked: false
		}))
		setColorButtons(newColorButtons)
	}, [])

	const playSound = () => {
		if (soundEnabled) {
			// Simple sound effect simulation
			const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhCDGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnkpBSl+zPLaizsIGGS57OScTgwOUarm7blmHgg2jdXzzn0vBSF0xe/glEILElyx6OyrWBUIQ5zd8sFuIAUuhM/z2YU2Bhxqvu7mnEoODlOq5O+zYBoGPJPY88p9KwUme8rx3I4+CRZiturqpVITC0ml4u6/bSEELIHO8diJOQcZZ7zs45ZODBFUquPvtGIaCD2T2fPJfSsFJnnK8dyOPgkWYbbq6qVSEwtJpeLuv20hBCyBzvHYiTkHGWe87OOWTgwRVKrj77RiGgg9k9nzyX0rBSZ5yvHcjj4JFmG26uqlUhMLS')
			audio.volume = 0.1
			audio.play().catch(() => {})
		}
	}

	const popBubble = (id: number) => {
		setBubbles(prev => prev.map(bubble => 
			bubble.id === id ? {...bubble, popped: true} : bubble
		))
		setScore(prev => prev + 1)
		playSound()
		toast.success('Pop! +1', {duration: 500})
	}

	const resetBubbles = () => {
		setBubbles(prev => prev.map(bubble => ({...bubble, popped: false})))
		setScore(0)
		toast.success('Bubble wrap reset!')
	}

	const toggleLight = (index: number) => {
		setLights(prev => {
			const newLights = [...prev]
			const currentLight = newLights[index]
			if (currentLight) {
				newLights[index] = {
					isOn: !currentLight.isOn,
					color: getRandomColor()
				}
			}
			return newLights
		})
		playSound()
		setScore(prev => prev + 2)
		const currentLight = lights[index]
		toast.success(`Light ${currentLight?.isOn ? 'OFF' : 'ON'}! +2`, {duration: 500})
	}

	const toggleSwitch = (index: number) => {
		setSwitches(prev => {
			const newSwitches = [...prev]
			const currentSwitch = newSwitches[index]
			if (currentSwitch) {
				newSwitches[index] = {
					isOn: !currentSwitch.isOn,
					color: getRandomColor()
				}
			}
			return newSwitches
		})
		playSound()
		setScore(prev => prev + 1)
	}

	const clickColorButton = (index: number) => {
		setColorButtons(prev => {
			const newButtons = [...prev]
			if (newButtons[index]) {
				newButtons[index] = {
					color: getRandomColor(),
					clicked: true
				}
			}
			return newButtons
		})
		
		setClickedButtons(prev => new Set([...prev, index]))
		setTimeout(() => {
			setClickedButtons(prev => {
				const newSet = new Set(prev)
				newSet.delete(index)
				return newSet
			})
			setColorButtons(prev => {
				const newButtons = [...prev]
				const currentButton = newButtons[index]
				if (currentButton) {
					newButtons[index] = {
						...currentButton,
						clicked: false
					}
				}
				return newButtons
			})
		}, 200)
		playSound()
		setScore(prev => prev + 1)
	}

	const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSliderValue(parseInt(e.target.value))
		setScore(prev => prev + 1)
	}

	return (
		<main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-2 sm:p-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-4 sm:mb-6">
					<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">⏰ Boring Time</h1>
					<div className="flex justify-center items-center gap-2 sm:gap-4 text-white">
						<div className="text-lg sm:text-xl">Score: {score}</div>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSoundEnabled(!soundEnabled)}
							className="bg-white/20 border-white/30 text-white hover:bg-white/30"
						>
							{soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={resetBubbles}
							className="bg-white/20 border-white/30 text-white hover:bg-white/30"
						>
							<RotateCcw className="w-4 h-4" />
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					{/* Bubble Wrap Area */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
						<h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
							<Circle className="w-4 h-4 sm:w-5 sm:h-5" />
							Bubble Wrap ({bubbles.filter(b => !b.popped).length}/60)
						</h2>
						<div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
							{bubbles.map(bubble => (
								<button
									key={bubble.id}
									onClick={() => !bubble.popped && popBubble(bubble.id)}
									className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-200 ${
										bubble.popped 
											? 'bg-gray-400 scale-75 cursor-not-allowed' 
											: 'bg-blue-400 hover:bg-blue-300 hover:scale-110 shadow-lg hover:shadow-xl active:scale-95'
									}`}
									disabled={bubble.popped}
								/>
							))}
						</div>
					</div>

					{/* Light Switch Area */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
						<h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
							<Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
							Light Switch ({lights.filter(l => l.isOn).length}/12)
						</h2>
						<div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
							{lights.map((light, index) => (
								<button
									key={index}
									onClick={() => toggleLight(index)}
									className={`h-12 sm:h-16 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
										light.isOn 
											? 'animate-pulse' 
											: 'bg-gray-600 hover:bg-gray-500'
									}`}
									style={{
										backgroundColor: light.isOn ? light.color : undefined,
										boxShadow: light.isOn ? `0 0 20px ${light.color}` : undefined
									}}
								>
									<Lightbulb className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto ${light.isOn ? 'text-white' : 'text-gray-400'}`} />
								</button>
							))}
						</div>
						<div className="mt-2 text-center text-white/70 text-xs sm:text-sm">
							Click to turn lights on/off! Colors change randomly!
						</div>
					</div>

					{/* Switch Area */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
						<h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
							<Star className="w-4 h-4 sm:w-5 sm:h-5" />
							Magic Switches
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
							{switches.map((switchItem, index) => (
								<button
									key={index}
									onClick={() => toggleSwitch(index)}
									className={`h-10 sm:h-12 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95`}
									style={{
										backgroundColor: switchItem.isOn ? switchItem.color : '#9ca3af',
										boxShadow: switchItem.isOn ? `0 0 15px ${switchItem.color}50` : undefined
									}}
								>
									<div className={`w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full mx-auto transition-transform duration-300 ${
										switchItem.isOn ? 'translate-x-2' : '-translate-x-2'
									}`} />
								</button>
							))}
						</div>
						<div className="mt-2 text-center text-white/70 text-xs sm:text-sm">
							Magic switches with random colors!
						</div>
					</div>

					{/* Color Buttons Area */}
					<div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
						<h2 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
							<Heart className="w-4 h-4 sm:w-5 sm:h-5" />
							Color Buttons
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
							{colorButtons.map((button, index) => (
								<button
									key={index}
									onClick={() => clickColorButton(index)}
									className={`h-12 sm:h-16 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg ${
										clickedButtons.has(index) ? 'scale-95 brightness-150' : ''
									}`}
									style={{
										backgroundColor: button.color,
										boxShadow: clickedButtons.has(index) ? `0 0 20px ${button.color}` : `0 4px 15px ${button.color}40`
									}}
								/>
							))}
						</div>
						<div className="mt-2 text-center text-white/70 text-xs sm:text-sm">
							Colors change with every click!
						</div>
					</div>
				</div>

				{/* Slider Area */}
				<div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
					<h2 className="text-lg sm:text-xl font-bold text-white mb-3">Boredom Slider - Current: {sliderValue}</h2>
					<input
						type="range"
						min="0"
						max="100"
						value={sliderValue}
						onChange={handleSliderChange}
						className="w-full h-2 sm:h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
						style={{
							background: `linear-gradient(to right, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #feca57 100%)`
						}}
					/>
				</div>

				{/* Bottom Stats */}
				<div className="text-center mt-4 sm:mt-6 text-white/80">
					<p className="text-sm sm:text-base">🎉 You've clicked {score} times! Keep going!</p>
					<p className="text-xs sm:text-sm mt-1">Click anywhere to score points and kill boredom!</p>
				</div>
			</div>
		</main>
	)
}
