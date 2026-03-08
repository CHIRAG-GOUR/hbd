import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
    const sectionRef = useRef(null)
    const titleRef = useRef(null)
    const [blown, setBlown] = useState(false)

    useEffect(() => {
        const section = sectionRef.current

        gsap.to(titleRef.current, {
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5,
            },
            y: -150,
            scale: 0.85,
            opacity: 0,
            filter: 'blur(10px)',
            rotationX: 10,
        })
    }, [])

    const mainWords = "Happy Birthday".split(' ')

    // Generates random floating balloons
    const balloons = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 12 + Math.random() * 15,
        scale: 0.6 + Math.random() * 0.7,
        color: ['#ff7ea3', '#fcd34d', '#c084fc', '#f472b6', '#ffffff'][Math.floor(Math.random() * 5)]
    }))

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-[110vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blush-900/40 via-midnight-900 to-midnight-900"
        >
            {/* Animated Balloons Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {balloons.map((b) => (
                    <motion.div
                        key={b.id}
                        initial={{ y: '120vh', x: `${b.x}vw`, rotate: -15 }}
                        animate={{ y: '-20vh', x: `${b.x + (Math.random() * 15 - 7.5)}vw`, rotate: 15 }}
                        transition={{
                            duration: b.duration,
                            repeat: Infinity,
                            delay: b.delay,
                            ease: 'linear'
                        }}
                        className="absolute w-16 h-20 rounded-[50%] blur-[0.5px] shadow-[inset_-5px_-5px_20px_rgba(0,0,0,0.15)] group"
                        style={{
                            background: `radial-gradient(circle at 35% 35%, #ffffff, ${b.color} 80%)`,
                            transform: `scale(${b.scale})`
                        }}
                    >
                        {/* Balloon highlight */}
                        <div className="absolute top-2 left-3 w-4 h-6 bg-white/40 rounded-full rotate-45 blur-[1px]" />
                        {/* Balloon string */}
                        <div className="absolute -bottom-12 left-1/2 w-[1px] h-16 bg-white/20 origin-top rotate-12" />
                    </motion.div>
                ))}
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blush-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div ref={titleRef} className="relative z-20 text-center px-4 w-full max-w-5xl perspective-[1000px] flex flex-col items-center mt-12">

                {/* Decorative Cake Illustration */}
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 15, delay: 0.3 }}
                    className="mb-8 relative"
                >
                    <div
                        className="w-48 h-48 relative flex items-end justify-center cursor-pointer group"
                        onClick={() => {
                            if (blown) return
                            setBlown(true)
                            setTimeout(() => {
                                document.getElementById('letter')?.scrollIntoView({ behavior: 'smooth' })
                            }, 1200)
                        }}
                    >
                        {/* Tooltip */}
                        <AnimatePresence>
                            {!blown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: 2, duration: 1 }}
                                    className="absolute -top-12 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/80 font-medium text-xs uppercase tracking-widest whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:bg-white/20 transition-colors"
                                >
                                    Make a wish & click to blow 🌬️
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Cake Shadow */}
                        <div className="absolute -bottom-2 w-40 h-6 bg-black/40 blur-md rounded-full transition-opacity duration-1000" style={{ opacity: blown ? 0.2 : 1 }} />

                        {/* Cake Base */}
                        <div className="w-36 h-20 bg-gradient-to-b from-white to-pink-50 rounded-xl relative shadow-2xl z-10 border border-white/50 border-b-4 border-b-blush-300 flex items-start justify-center overflow-hidden">
                            {/* Frosting drips */}
                            <div className="w-full h-8 bg-blush-400 absolute top-0 rounded-b-xl opacity-90 shadow-sm" />
                            <div className="w-10 h-12 bg-blush-400 absolute top-0 left-4 rounded-b-full shadow-md" />
                            <div className="w-8 h-10 bg-blush-400 absolute top-0 right-6 rounded-b-full shadow-md" />
                            <div className="w-12 h-14 bg-blush-400 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full shadow-md" />

                            {/* Cake Sprinkles Base */}
                            <div className="absolute bottom-4 left-6 w-2 h-1 bg-purple-400 rounded-full rotate-45" />
                            <div className="absolute bottom-6 right-8 w-2 h-1 bg-yellow-400 rounded-full -rotate-12" />
                            <div className="absolute bottom-8 left-1/2 w-2 h-1 bg-blue-400 rounded-full rotate-90" />
                        </div>

                        {/* Cake Top Tier */}
                        <div className="w-28 h-14 bg-gradient-to-b from-white to-pink-100 rounded-xl absolute bottom-20 shadow-xl z-20 border border-white/50 border-b-2 border-b-blush-200 overflow-hidden">
                            <div className="w-full h-6 bg-purple-300 absolute top-0 rounded-b-lg opacity-90 shadow-sm" />
                            <div className="w-8 h-8 bg-purple-300 absolute top-0 left-3 rounded-b-full" />
                            <div className="w-8 h-8 bg-purple-300 absolute top-0 right-3 rounded-b-full" />
                        </div>

                        {/* Candles */}
                        <div className="absolute bottom-32 flex gap-5 z-0">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-2.5 h-10 bg-gradient-to-t from-white to-pink-200 rounded-full relative shadow-sm border border-white/40">
                                    {/* Candle Stripes */}
                                    <div className="absolute top-2 w-full h-2 bg-pink-400/30 -skew-y-12" />
                                    <div className="absolute top-6 w-full h-2 bg-pink-400/30 -skew-y-12" />

                                    {/* Flame & Glow */}
                                    <AnimatePresence>
                                        {!blown && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0, y: -10, transition: { duration: 0.5 } }}
                                                className="absolute -top-6 -left-2 w-full h-full flex justify-center"
                                            >
                                                <motion.div
                                                    animate={{
                                                        scale: [1, 1.15, 0.9, 1.1, 1],
                                                        opacity: [0.8, 1, 0.7, 1, 0.8],
                                                        rotate: [0, -5, 5, 0]
                                                    }}
                                                    transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity }}
                                                    className="w-4.5 h-6 bg-gradient-to-t from-yellow-300 via-orange-400 to-red-500 rounded-full blur-[0.5px] shadow-[0_0_10px_#fcd34d] absolute top-1 left-1"
                                                    style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                                                />
                                                <div className="w-6 h-8 bg-yellow-400/20 rounded-full blur-md absolute top-0 left-0" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Smoke Trail after blowing */}
                                    <AnimatePresence>
                                        {blown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                                animate={{ opacity: [0, 0.8, 0], y: -30, scale: 2 }}
                                                transition={{ duration: 2, ease: 'easeOut' }}
                                                className="absolute -top-4 left-0 w-2 h-2 bg-white/40 rounded-full blur-[2px]"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Main Title */}
                <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold mb-2 leading-none tracking-tighter z-10">
                    {mainWords.map((word, i) => (
                        <span key={i} className="inline-block overflow-hidden mr-[2vw] last:mr-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                            <motion.span
                                initial={{ y: '100%', rotateX: -90, opacity: 0 }}
                                animate={{ y: 0, rotateX: 0, opacity: 1 }}
                                transition={{
                                    duration: 1.2,
                                    delay: i * 0.2 + 0.6,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-50 to-blush-200"
                                style={{ transformOrigin: 'bottom center' }}
                            >
                                {word}
                            </motion.span>
                        </span>
                    ))}
                </h1>

                {/* Name Subtitle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 1.4, type: 'spring', damping: 12 }}
                    className="relative z-20 mt-[-10px]"
                >
                    <p
                        className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-bold tracking-wider drop-shadow-[0_0_30px_rgba(255,126,163,0.8)]"
                        style={{ fontFamily: 'var(--font-script)', color: '#ff7ea3', WebkitTextStroke: '1.5px rgba(255,255,255,0.4)' }}
                    >
                        Reeya
                    </p>

                    {/* Sparkles around name */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-[-60px] pointer-events-none"
                    >
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-4 right-10 text-yellow-300 text-2xl drop-shadow-md">✨</motion.div>
                        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} className="absolute bottom-4 left-10 text-pink-300 text-3xl drop-shadow-md">✨</motion.div>
                        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }} className="absolute top-1/2 -left-4 text-white text-xl drop-shadow-[0_0_5px_white]">✨</motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.4, duration: 2 }}
                    className="mt-10 text-lg md:text-xl text-white/80 max-w-lg mx-auto font-medium tracking-widest uppercase text-shadow-sm flex items-center justify-center gap-6"
                >
                    <span className="w-16 h-[2px] bg-gradient-to-r from-transparent to-blush-400 rounded-full" />
                    Celebrating You
                    <span className="w-16 h-[2px] bg-gradient-to-l from-transparent to-blush-400 rounded-full" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 1, type: 'spring' }}
                    className="mt-14 flex justify-center"
                >
                    <button
                        onClick={() => document.getElementById('letter')?.scrollIntoView({ behavior: 'smooth' })}
                        className="skeu-btn group flex items-center gap-4 px-10 py-5 text-sm tracking-widest uppercase rounded-full bg-gradient-to-r from-blush-500 to-purple-500 shadow-[0_10px_40px_rgba(255,126,163,0.5)] border border-white/30 hover:scale-105 hover:shadow-[0_15px_50px_rgba(255,126,163,0.7)] transition-all duration-300"
                    >
                        <span className="font-bold">Begin Our Story</span>
                        <motion.span
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="bg-white/20 rounded-full p-1"
                        >
                            ↓
                        </motion.span>
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
