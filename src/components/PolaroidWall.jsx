import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const POLAROIDS = [
    {
        id: 1,
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        rotation: -3,
        message: "The day I knew you were the one 💕",
        label: "First Date",
    },
    {
        id: 2,
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        rotation: 2,
        message: "Your laugh is my favorite sound 🎶",
        label: "Our Song",
    },
    {
        id: 3,
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        rotation: -1,
        message: "Every sunset reminds me of you 🌅",
        label: "Golden Hour",
    },
    {
        id: 4,
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        rotation: 3,
        message: "You make my world brighter ✨",
        label: "Starry Night",
    },
    {
        id: 5,
        gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
        rotation: -2,
        message: "Adventures with you are my favorite 🗺️",
        label: "Adventure Day",
    },
    {
        id: 6,
        gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
        rotation: 1,
        message: "You're my home, wherever you are 🏡",
        label: "Cozy Morning",
    },
    {
        id: 7,
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        rotation: -4,
        message: "Dancing with you is pure magic 💃",
        label: "Dance Floor",
    },
    {
        id: 8,
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        rotation: 2,
        message: "I love how we dream together 🌙",
        label: "Dream Together",
    },
    {
        id: 9,
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        rotation: -1,
        message: "You complete every sentence of my heart 💖",
        label: "Us Forever",
    },
]

function PolaroidCard({ polaroid, index }) {
    const [flipped, setFlipped] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 60, rotate: polaroid.rotation * 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: polaroid.rotation }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            onClick={() => setFlipped(!flipped)}
            className="cursor-pointer perspective-[1000px] group"
        >
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative"
            >
                {/* Front Side */}
                <div
                    className="polaroid relative"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    {/* Photo area */}
                    <div
                        className="w-full aspect-square rounded-sm overflow-hidden relative"
                        style={{ background: polaroid.gradient }}
                    >
                        {/* Decorative elements on the photo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.span
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-4xl md:text-5xl opacity-60 drop-shadow-lg"
                            >
                                📷
                            </motion.span>
                        </div>
                        {/* Tap hint */}
                        <div className="absolute bottom-2 right-2 text-xs text-white/70 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            Tap to flip 💌
                        </div>
                    </div>
                    {/* Label */}
                    <p
                        className="text-center mt-2 text-gray-700 text-sm font-medium"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        {polaroid.label}
                    </p>
                </div>

                {/* Back Side */}
                <div
                    className="polaroid absolute inset-0 flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: 'linear-gradient(135deg, #ffe4e6, #f3e8ff)',
                    }}
                >
                    <div className="text-center px-4 py-6">
                        <div className="text-3xl mb-3">💌</div>
                        <p
                            className="text-gray-700 text-base leading-relaxed font-medium"
                            style={{ fontFamily: 'var(--font-script)' }}
                        >
                            {polaroid.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-3">tap to flip back</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function PolaroidWall() {
    const sectionRef = useRef(null)
    const titleRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(titleRef.current,
            { opacity: 0, y: 60 },
            {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                }
            }
        )
    }, [])

    return (
        <div ref={sectionRef} className="min-h-screen py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div ref={titleRef} className="text-center mb-12">
                    <h2
                        className="text-4xl md:text-6xl font-bold mb-4 shimmer-text"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        Our Photo Wall 📸
                    </h2>
                    <p className="text-white/50 text-lg">Tap a photo to reveal hidden love notes</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                    {POLAROIDS.map((p, i) => (
                        <PolaroidCard key={p.id} polaroid={p} index={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}
