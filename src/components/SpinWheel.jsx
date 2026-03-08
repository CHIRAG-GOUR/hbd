import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Added specific GIFs for exactly the 6 topics requested, using reliable Giphy links
const REWARDS = [
    { text: 'A Tight Hug', color: '#0284c7', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z0d2pscjZpNGQyZm0zZmYzcDhwcG41bWc5YW4zMXVzdHZqYnIzZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3og0IPnA1oFwF0q3Oo/giphy.gif' },
    { text: 'Handwritten Letter', color: '#fb7185', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z0d2pscjZpNGQyZm0zZmYzcDhwcG41bWc5YW4zMXVzdHZqYnIzZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0ExceV0pUExQz2yA/giphy.gif' },
    { text: 'A Dance Together', color: '#f472b6', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGJycHc2MzRyMThrbmFmMW80bWV1bml3OGV1cmR5dGhqNWFjdGkzNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26AHG5KGFxSkUWw1i/giphy.gif' },
    { text: 'Surprise Coffee', color: '#ec4899', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGJycHc2MzRyMThrbmFmMW80bWV1bml3OGV1cmR5dGhqNWFjdGkzNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0Hlx0M5OI1pdQvQc/giphy.gif' },
    { text: 'Long Drive', color: '#38bdf8', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGJycHc2MzRyMThrbmFmMW80bWV1bml3OGV1cmR5dGhqNWFjdGkzNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7aD2saalBwwftBIY/giphy.gif' },
    { text: 'Endless Cuddles', color: '#e0f2fe', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z0d2pscjZpNGQyZm0zZmYzcDhwcG41bWc5YW4zMXVzdHZqYnIzZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4pTfx2qLszoacZRS/giphy.gif' },
]

export default function SpinWheel() {
    const [spinning, setSpinning] = useState(false)
    const [result, setResult] = useState(null)
    const [rotation, setRotation] = useState(0)
    const [showSparks, setShowSparks] = useState(false)
    const wheelRef = useRef(null)
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
    }, [])

    const spin = () => {
        if (spinning) return
        setSpinning(true)
        setResult(null)
        setShowSparks(false)

        const segmentAngle = 360 / REWARDS.length
        const winnerIndex = Math.floor(Math.random() * REWARDS.length)
        const extraSpins = 6 + Math.floor(Math.random() * 4)
        const targetAngle = extraSpins * 360 + (360 - winnerIndex * segmentAngle - segmentAngle / 2)

        const newRotation = rotation + targetAngle

        gsap.to(wheelRef.current, {
            rotation: newRotation,
            duration: 5 + Math.random() * 2,
            ease: 'power4.out',
            onComplete: () => {
                setRotation(newRotation)
                setSpinning(false)
                setResult(REWARDS[winnerIndex])
                setShowSparks(true)
                setTimeout(() => setShowSparks(false), 3000)
            },
        })
    }

    const segmentAngle = 360 / REWARDS.length

    return (
        <div ref={sectionRef} className="min-h-[90vh] flex items-center justify-center py-20 px-4">
            <div ref={contentRef} className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">

                {/* Wheel Side */}
                <div className="flex-1 w-full flex flex-col items-center">
                    <div className="text-center mb-10">
                        <h2
                            className="text-4xl md:text-6xl font-bold mb-3 text-shimmer"
                            style={{ fontFamily: 'var(--font-script)' }}
                        >
                            Wheel of Affection
                        </h2>
                        <p className="text-white/40 text-sm uppercase tracking-widest font-light">
                            Destiny's little treats
                        </p>
                    </div>

                    <div className="frost rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/20 w-fit mx-auto backdrop-blur-2xl">

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-frost-500/10 rounded-full blur-[80px]" />

                        {showSparks && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                                {Array.from({ length: 50 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: '50%', y: '50%', scale: 0, opacity: 1 }}
                                        animate={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, scale: [0, 1.5, 0], opacity: [1, 1, 0], rotate: Math.random() * 720 }}
                                        transition={{ duration: 1.5 + Math.random(), ease: 'easeOut' }}
                                        className="absolute w-1.5 h-4 rounded-full"
                                        style={{ background: ['#38bdf8', '#0ea5e9', '#f472b6', '#ffffff'][Math.floor(Math.random() * 4)], boxShadow: '0 0 15px currentColor' }}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="relative z-10 mb-[-12px]">
                            <svg width="36" height="46" viewBox="0 0 30 40" className="drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)]">
                                <path d="M15 40 L0 15 A15 15 0 0 1 30 15 Z" fill="#f472b6" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
                            </svg>
                        </div>

                        <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px]">
                            <div className="absolute inset-[-12px] rounded-full border border-white/10 shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] bg-midnight-900/40 backdrop-blur-sm" />

                            <svg
                                ref={wheelRef}
                                viewBox="0 0 300 300"
                                className="w-full h-full drop-shadow-2xl relative z-10"
                                style={{ transformOrigin: 'center center' }}
                            >
                                {/* Same wheel rendering as before but with aligned colors */}
                                {REWARDS.map((reward, i) => {
                                    const startAngle = i * segmentAngle
                                    const endAngle = (i + 1) * segmentAngle
                                    const startRad = (startAngle - 90) * (Math.PI / 180)
                                    const endRad = (endAngle - 90) * (Math.PI / 180)

                                    const x1 = 150 + 140 * Math.cos(startRad)
                                    const y1 = 150 + 140 * Math.sin(startRad)
                                    const x2 = 150 + 140 * Math.cos(endRad)
                                    const y2 = 150 + 140 * Math.sin(endRad)

                                    const largeArc = segmentAngle > 180 ? 1 : 0
                                    const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180)
                                    const textX = 150 + 85 * Math.cos(midAngle)
                                    const textY = 150 + 85 * Math.sin(midAngle)

                                    return (
                                        <g key={i}>
                                            <path
                                                d={`M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                fill={reward.color}
                                                stroke="rgba(255,255,255,0.2)"
                                                strokeWidth="1.5"
                                                opacity={0.8}
                                            />
                                            <text
                                                x={textX}
                                                y={textY}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fill="white"
                                                fontSize="12"
                                                fontWeight="600"
                                                letterSpacing="0.5"
                                                transform={`rotate(${(startAngle + endAngle) / 2}, ${textX}, ${textY})`}
                                                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                                            >
                                                {reward.text.split(' ').map((word, index) => (
                                                    <tspan x={textX} dy={index === 0 ? '-0.5em' : '1.2em'} key={index}>
                                                        {word}
                                                    </tspan>
                                                ))}
                                            </text>
                                        </g>
                                    )
                                })}
                                <circle cx="150" cy="150" r="32" fill="#070b19" stroke="url(#goldGrad)" strokeWidth="4" />
                                <circle cx="150" cy="150" r="22" fill="#121e42" />
                                <circle cx="150" cy="150" r="6" fill="#fcd34d" />
                                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#38bdf8" />
                                    <stop offset="50%" stopColor="#f472b6" />
                                    <stop offset="100%" stopColor="#0ea5e9" />
                                </linearGradient>
                            </svg>
                        </div>

                        <button
                            onClick={spin}
                            disabled={spinning}
                            className={`mt-14 skeu-btn tracking-[0.2em] uppercase px-16 py-4 relative z-20 ${spinning ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105'}`}
                        >
                            {spinning ? 'Spinning...' : 'Spin'}
                        </button>
                    </div>
                </div>

                {/* Result Side with GIF */}
                <div className="flex-1 w-full max-w-sm flex items-center justify-center h-full min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!result ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="w-full h-full flex items-center justify-center p-8 rounded-[2rem] border border-dashed border-white/20 bg-white/5 backdrop-blur-sm"
                            >
                                <p className="text-white/30 text-center uppercase tracking-widest font-light text-sm">Waiting for destiny...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20, scale: 0.9, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                                className="w-full text-center"
                            >
                                <div className="glass-card rounded-[2.5rem] p-6 border border-white/30 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">

                                    {/* Glowing background colored by result */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute inset-0 opacity-20"
                                        style={{ background: `radial-gradient(circle at top, ${result.color}, transparent 70%)` }}
                                    />

                                    <div className="relative z-10">
                                        <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-4 font-medium">You Won</p>
                                        <h3
                                            className="text-4xl lg:text-5xl font-bold mb-6 drop-shadow-lg"
                                            style={{ fontFamily: 'var(--font-script)', color: result.color, textShadow: `0 0 20px ${result.color}80` }}
                                        >
                                            {result.text}
                                        </h3>

                                        {/* GIF Image Reveal */}
                                        <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-inner relative group">
                                            <img src={result.gif} alt={result.text} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 box-shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] pointer-events-none rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    )
}
