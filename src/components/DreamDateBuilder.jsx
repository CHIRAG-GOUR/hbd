import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = {
    vibe: {
        label: 'Atmosphere',
        items: [
            { id: 'v1', name: 'Candlelit Intimacy' },
            { id: 'v2', name: 'Starlit Wonder' },
            { id: 'v3', name: 'Golden Hour Glow' },
            { id: 'v4', name: 'Quiet Rain' },
            { id: 'v5', name: 'Vintage Elegance' },
            { id: 'v6', name: 'Neon Cityscape' },
        ],
    },
    savor: {
        label: 'Culinary',
        items: [
            { id: 's1', name: 'Handmade Pasta' },
            { id: 's2', name: 'Midnight Desserts' },
            { id: 's3', name: 'Street Food Tour' },
            { id: 's4', name: 'Wine & Cheese' },
            { id: 's5', name: 'Warm Comfort Soup' },
            { id: 's6', name: 'Aesthetic Cafe Pastries' },
        ],
    },
    moment: {
        label: 'Experience',
        items: [
            { id: 'm1', name: 'Deep Conversations' },
            { id: 'm2', name: 'Silent Art Viewing' },
            { id: 'm3', name: 'Listening to Vinyl' },
            { id: 'm4', name: 'Night Drive' },
            { id: 'm5', name: 'Slow Dancing' },
            { id: 'm6', name: 'Reading Together' },
        ],
    },
}

const MESSAGES = [
    "No matter where we go or what we do, as long as I have you by my side, that's my perfect date.",
    "You make every ordinary moment feel like a scene from a romantic movie.",
    "I'd choose a quiet evening with you over the grandest event in the world.",
    "Just being near you makes my heart race. That's the only plan I need.",
    "Our time together is my favorite place to be."
]

export default function DreamDateBuilder() {
    const [selected, setSelected] = useState({
        vibe: null,
        savor: null,
        moment: null,
    })
    const [showResult, setShowResult] = useState(false)
    const [dateMessage, setDateMessage] = useState("")
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

    const selectItem = (category, item) => {
        setSelected(prev => ({ ...prev, [category]: item }))
        setShowResult(false)
    }

    const allSelected = Object.values(selected).every(v => v !== null)

    const buildDate = () => {
        if (allSelected) {
            setDateMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
            setShowResult(true)
        }
    }

    const reset = () => {
        setSelected({ vibe: null, savor: null, moment: null })
        setShowResult(false)
    }

    return (
        <div ref={sectionRef} className="min-h-screen flex items-center justify-center py-20 px-4">
            <div ref={contentRef} className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl md:text-6xl font-bold mb-4 text-shimmer"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        Design Our Evening
                    </h2>
                    <p className="text-white/40 text-sm uppercase tracking-widest font-light">
                        Curate the perfect memory
                    </p>
                </div>

                <div className="glass-card rounded-[2rem] p-6 md:p-12 border border-white/10 shadow-2xl backdrop-blur-xl">
                    <div className="grid md:grid-cols-3 gap-8 mb-10">
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                            <div key={key} className="flex flex-col">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <h3 className="text-sm font-light text-white/50 uppercase tracking-[0.2em] relative inline-block">
                                        <span className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-l from-white/40 to-transparent" />
                                        {cat.label}
                                        <span className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-white/40 to-transparent" />
                                    </h3>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {cat.items.map((item) => (
                                        <motion.button
                                            key={item.id}
                                            onClick={() => selectItem(key, item)}
                                            className={`relative overflow-hidden text-center justify-center px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 ${selected[key]?.id === item.id
                                                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-blush-400/30'
                                                : 'bg-transparent text-white/40 border border-white/5 hover:bg-white/5 hover:text-white/70 hover:border-white/10'
                                                }`}
                                        >
                                            <span className="relative z-10">{item.name}</span>

                                            {/* Selection glow */}
                                            {selected[key]?.id === item.id && (
                                                <motion.div
                                                    layoutId={`highlight-${key}`}
                                                    className="absolute inset-0 bg-gradient-to-r from-blush-500/10 to-frost-500/10"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                />
                                            )}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-6 mt-12 items-center">
                        {Object.values(selected).some(v => v) && (
                            <button onClick={reset} className="text-white/40 text-xs tracking-widest uppercase hover:text-white transition-colors">
                                Clear
                            </button>
                        )}
                        <button
                            onClick={buildDate}
                            disabled={!allSelected}
                            className={`skeu-btn uppercase tracking-widest px-12 py-4 ${!allSelected ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                        >
                            Visualize
                        </button>
                    </div>

                    <AnimatePresence>
                        {showResult && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="mt-12 overflow-hidden"
                            >
                                <div className="frost rounded-[1.5rem] p-8 md:p-12 text-center border-t border-b border-blush-400/20 relative">

                                    {/* Decorative faint quote marks */}
                                    <span className="absolute top-4 left-6 text-6xl text-white/5 font-serif">"</span>
                                    <span className="absolute bottom-[-20px] right-8 text-6xl text-white/5 font-serif">"</span>

                                    <h3
                                        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blush-300 to-frost-300 mb-8 pb-4 border-b border-white/10"
                                        style={{ fontFamily: 'var(--font-script)' }}
                                    >
                                        Our Curated Evening
                                    </h3>

                                    <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-8 italic">
                                        Feeling the warmth of <span className="text-blush-300">{selected.vibe?.name.toLowerCase()}</span>,
                                        we'll indulge in <span className="text-frost-300">{selected.savor?.name.toLowerCase()}</span> while
                                        losing ourselves in <span className="text-gold-300">{selected.moment?.name.toLowerCase()}</span>.
                                    </p>

                                    <div className="max-w-xl mx-auto p-5 bg-midnight-900/50 rounded-xl border border-white/5">
                                        <p className="text-sm font-medium text-white/70 tracking-wide leading-relaxed">
                                            "{dateMessage}"
                                        </p>
                                        <p className="text-xs text-white/40 mt-3 font-script text-right uppercase tracking-[0.2em]">
                                            — Chirag
                                        </p>
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
