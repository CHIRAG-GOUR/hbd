import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Photo placeholders - User can replace these with actual image URLs of them
const PHOTOS = [
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=400&h=400',
]

const MESSAGES = [
    "You are my safest place.",
    "Every memory with you is a treasure.",
    "Your smile is my favorite view.",
    "Forever grateful for 'us'.",
]

function createPhotoItem(canvasW, canvasH) {
    const isImage = Math.random() > 0.4;

    return {
        id: Math.random().toString(36).substr(2, 9),
        type: isImage ? 'photo' : 'sparkle',
        imgUrl: isImage ? PHOTOS[Math.floor(Math.random() * PHOTOS.length)] : null,
        x: Math.random() * (canvasW - 100) + 50,
        y: -100,
        size: isImage ? (70 + Math.random() * 40) : (10 + Math.random() * 15),
        speed: isImage ? (1.5 + Math.random() * 2) : (2 + Math.random() * 3),
        wobble: Math.random() * 2.5 - 1.25,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 3,
        message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
        caught: false,
    }
}

export default function CatchMemories() {
    const [gameActive, setGameActive] = useState(false)
    const [items, setItems] = useState([])
    const [score, setScore] = useState(0)
    const [revealedMessage, setRevealedMessage] = useState(null)
    const [timeLeft, setTimeLeft] = useState(30)

    const canvasContainerRef = useRef(null)
    const animRef = useRef(null)
    const sectionRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 80 },
            {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                }
            }
        )
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current)
        }
    }, [])

    const startGame = () => {
        setGameActive(true)
        setScore(0)
        setItems([])
        setTimeLeft(30)
        setRevealedMessage(null)
    }

    // Timer
    useEffect(() => {
        if (!gameActive) return
        if (timeLeft <= 0) {
            setGameActive(false)
            return
        }
        const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
        return () => clearTimeout(timer)
    }, [gameActive, timeLeft])

    // Spawn items
    useEffect(() => {
        if (!gameActive) return
        let counter = 0;

        // Custom animation loop for spawning to prevent interval lag
        const spawnLoop = () => {
            counter++;
            if (counter % 35 === 0) { // roughly every 600ms at 60fps
                const w = canvasContainerRef.current?.offsetWidth || window.innerWidth
                const h = canvasContainerRef.current?.offsetHeight || 500
                setItems(prev => [...prev, createPhotoItem(w, h)])
            }
            animRef.current = requestAnimationFrame(spawnLoop)
        }

        animRef.current = requestAnimationFrame(spawnLoop)
        return () => cancelAnimationFrame(animRef.current)
    }, [gameActive])

    // Move items (using pure CSS for positions for better performance, but calculating in requestAnimationFrame)
    useEffect(() => {
        if (!gameActive) return
        const moveLoop = setInterval(() => {
            setItems(prev => {
                const maxH = canvasContainerRef.current?.offsetHeight || 500
                return prev
                    .map(item => ({
                        ...item,
                        y: item.y + item.speed,
                        x: item.x + Math.sin(item.y * 0.015) * item.wobble,
                        rotation: item.rotation + item.rotSpeed,
                    }))
                    .filter(item => item.y < maxH + 100 && !item.caught)
            })
        }, 16) // roughly 60fps update

        return () => clearInterval(moveLoop)
    }, [gameActive])

    const catchItem = (item) => {
        if (item.type !== 'photo') return // Only catch photos

        setItems(prev => prev.filter(i => i.id !== item.id))
        setScore(s => s + 1)

        // Reveal message
        setRevealedMessage({ text: item.message, id: Date.now() })
    }

    return (
        <div ref={sectionRef} className="min-h-[90vh] flex items-center justify-center py-20 px-4">
            <div ref={contentRef} className="max-w-4xl w-full">
                <div className="text-center mb-10">
                    <h2
                        className="text-4xl md:text-6xl font-bold mb-4 text-shimmer"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        Catching Memories
                    </h2>
                    <p className="text-white/50 text-base uppercase tracking-[0.2em] font-light">
                        Tap the falling photographs
                    </p>
                </div>

                <div className="glass-card rounded-[2rem] p-4 md:p-8 relative overflow-hidden backdrop-blur-2xl">

                    {/* Header Stats */}
                    <div className="flex justify-between items-center mb-6 px-4">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-widest text-white/50">Memories Collected</span>
                            <span className="text-3xl font-light text-blush-300">{score}</span>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-xs uppercase tracking-widest text-white/50">Time Remaining</span>
                            <span className={`text-3xl font-light ${timeLeft <= 5 ? 'text-red-400' : 'text-frost-300'}`}>
                                {timeLeft > 0 ? `0:${timeLeft.toString().padStart(2, '0')}` : '0:00'}
                            </span>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div
                        ref={canvasContainerRef}
                        className="relative w-full h-[450px] md:h-[550px] bg-midnight-900/40 rounded-[1.5rem] border border-white/5 overflow-hidden shadow-inner"
                    >
                        {/* Background grid pattern */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                        {!gameActive && timeLeft === 30 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm bg-midnight-900/40">
                                <div className="w-20 h-20 border border-white/20 scale-110 mb-8 rounded-full flex items-center justify-center rotate-45 relative">
                                    <div className="w-16 h-16 border border-blush-400/50 rounded-full flex items-center justify-center -rotate-45">
                                        <span className="text-2xl opacity-60">📷</span>
                                    </div>
                                </div>
                                <button onClick={startGame} className="skeu-btn tracking-widest px-12">
                                    START
                                </button>
                            </div>
                        )}

                        {!gameActive && timeLeft <= 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-md bg-midnight-900/70">
                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                                    <h3 className="text-4xl mb-4 font-light text-blush-300" style={{ fontFamily: 'var(--font-script)' }}>
                                        Time Stands Still
                                    </h3>
                                    <p className="text-white/60 mb-2 uppercase tracking-widest text-sm">You saved {score} beautiful moments</p>

                                    <button onClick={startGame} className="skeu-btn tracking-widest mt-8">
                                        PLAY AGAIN
                                    </button>
                                </motion.div>
                            </div>
                        )}

                        {/* Falling Items */}
                        <AnimatePresence>
                            {items.map(item => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute cursor-pointer will-change-transform shadow-2xl"
                                    style={{
                                        left: item.x,
                                        top: item.y,
                                        width: item.size,
                                        height: item.size,
                                        transform: `rotate(${item.rotation}deg)`,
                                        zIndex: 10,
                                    }}
                                    onClick={() => catchItem(item)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.type === 'photo' ? (
                                        <div className="w-full h-full bg-white p-2 pb-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/50">
                                            <div className="w-full h-full bg-gray-200 overflow-hidden relative">
                                                <img src={item.imgUrl} alt="Memory" className="w-full h-full object-cover pointer-events-none filter grayscale hover:grayscale-0 transition-all duration-500" />
                                                <div className="absolute inset-0 bg-blush-500/10 mix-blend-overlay"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-frost-300/60 blur-[2px]" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Display Revealed Message Overlay */}
                        <AnimatePresence>
                            {revealedMessage && (
                                <motion.div
                                    key={revealedMessage.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 w-[80%] max-w-sm pointer-events-none"
                                >
                                    <div className="frost rounded-xl p-4 text-center border-t border-white/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                                        <p className="text-xl font-medium text-white shadow-sm" style={{ fontFamily: 'var(--font-script)' }}>
                                            "{revealedMessage.text}"
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
