import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LoveCalculator() {
    const [num1, setNum1] = useState('')
    const [num2, setNum2] = useState('')
    const [operator, setOperator] = useState('+')
    const [result, setResult] = useState(null)
    const [blockZero, setBlockZero] = useState(false)
    const [showMessage, setShowMessage] = useState(false)
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

    const handleCalculate = () => {
        const a = parseFloat(num1) || 0
        const b = parseFloat(num2) || 0

        // Love is always 95% or more and randomized
        const baseLove = 95
        const randomBonus = (Math.random() * 5).toFixed(1)
        const loveResult = (baseLove + parseFloat(randomBonus))

        // Random fun replies
        const funReplies = [
            'Algorithm entirely broken by pure love.',
            'Error: Capacity exceeded. Heart too full.',
            'Warning: Dangerous levels of affection detected.',
            'Math cannot comprehend this connection.',
            'Data overflow. You two are meant to be.',
            'Probability of soulmates: Absolute certainty.'
        ]

        const randomMsg = funReplies[Math.floor(Math.random() * funReplies.length)]

        setResult({ score: loveResult, msg: randomMsg })
        setBlockZero(false)
    }

    return (
        <div ref={sectionRef} className="min-h-[80vh] flex items-center justify-center py-20 px-4">
            <div ref={contentRef} className="max-w-2xl w-full">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl md:text-6xl font-bold mb-4 text-shimmer"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        Mathematical Love
                    </h2>
                    <p className="text-white/50 text-lg uppercase tracking-widest text-sm font-light">
                        An equation that only grows
                    </p>
                </div>

                {/* Main Calculator Card */}
                <div className="frost rounded-3xl p-8 md:p-12 relative overflow-hidden border border-white/20">

                    {/* Subtle background element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-frost-500/10 rounded-full blur-[80px]" />

                    {/* Zero Blocking Speech Bubble */}
                    <AnimatePresence>
                        {showMessage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%]"
                            >
                                <div className="glass-card rounded-2xl px-6 py-4 text-center border border-blush-400/30">
                                    <p className="text-xl font-medium text-blush-300 tracking-wide">
                                        "No. Love can never be zero."
                                    </p>
                                    <p className="text-xs text-white/50 mt-2 uppercase tracking-widest font-light">
                                        Attempted division by reality failed
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Calculator Interface */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center mb-10 pt-8 relative z-10 w-full">
                        <div className="w-full sm:w-40">
                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3 text-center">First Name</label>
                            <input
                                type="text"
                                value={num1}
                                onChange={(e) => setNum1(e.target.value)}
                                placeholder="e.g. Chirag"
                                className="w-full skeu-input text-center text-lg placeholder:text-sm"
                            />
                        </div>

                        {/* Visual Connector instead of Operator */}
                        <div className="flex mt-6 items-center justify-center">
                            <div className="w-12 h-12 rounded-full font-bold text-2xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-blush-500 to-frost-500 text-white shadow-[0_4px_15px_rgba(255,77,126,0.5)] ring-2 ring-white/10 animate-pulse">
                                +
                            </div>
                        </div>

                        <div className="w-full sm:w-40">
                            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3 text-center">Second Name</label>
                            <input
                                type="text"
                                value={num2}
                                onChange={(e) => setNum2(e.target.value)}
                                placeholder="e.g. Reeya"
                                className="w-full skeu-input text-center text-lg placeholder:text-sm"
                            />
                        </div>
                    </div>

                    <div className="text-center relative z-10">
                        <button onClick={handleCalculate} className="skeu-btn px-12 md:px-16 py-4">
                            <span className="tracking-widest relative z-10">Calculate</span>
                        </button>
                    </div>

                    {/* Result Area */}
                    <div className="min-h-[140px] flex items-center justify-center mt-6">
                        <AnimatePresence mode="wait">
                            {result && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                                    className="text-center"
                                >
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                        className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blush-400 to-frost-400 drop-shadow-[0_0_30px_rgba(255,77,126,0.5)]"
                                        style={{ fontFamily: 'var(--font-script)' }}
                                    >
                                        {result.score}%
                                    </motion.div>
                                    <p className="text-white/80 text-sm tracking-widest uppercase mt-6 mx-auto max-w-sm font-medium leading-relaxed drop-shadow-md">
                                        {result.msg}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
