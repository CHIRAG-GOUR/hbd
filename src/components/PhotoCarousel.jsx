import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Exactly 5 Photos
const PHOTOS = [
    { img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800', caption: 'Quiet moments' },
    { img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800', caption: 'Your smile' },
    { img: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&q=80&w=800', caption: 'Our favorite day' },
    { img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800', caption: 'City lights' },
    { img: 'https://images.unsplash.com/photo-1518599904199-0ca897819ddb?auto=format&fit=crop&q=80&w=800', caption: 'Lost in time' },
]

export default function PhotoCarousel() {
    const [activeIndex, setActiveIndex] = useState(2) // Start at center (item 3 of 5)
    const containerRef = useRef(null)
    const contentRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 100 },
            {
                opacity: 1, y: 0, duration: 1.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                }
            }
        )
    }, [])

    return (
        <div ref={containerRef} className="min-h-screen flex flex-col items-center justify-center py-24 px-4 overflow-hidden relative">

            {/* Background radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-frost-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div ref={contentRef} className="w-full max-w-6xl mx-auto flex flex-col items-center z-10">

                <div className="text-center mb-16">
                    <h2
                        className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-frost-300 to-blush-400"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        Gallery of Us
                    </h2>
                    <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-light">
                        A timeless collection of 5 memories
                    </p>
                </div>

                {/* Dynamic 5-Item Carousel */}
                <div className="relative w-full h-[500px] flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                        {PHOTOS.map((photo, i) => {
                            // Calculate positional logic
                            // i: index of photo
                            // activeIndex: index of currently focused photo (0-4)

                            const isActive = i === activeIndex
                            const isPrev = i === activeIndex - 1
                            const isNext = i === activeIndex + 1

                            let xOffset = 0
                            let scale = 0.7
                            let zIndex = 0
                            let rotateY = 0
                            let opacity = 0

                            // Only render 3 items at a time visibly for performance and cover-flow logic
                            if (isActive) {
                                xOffset = 0
                                scale = 1
                                zIndex = 10
                                rotateY = 0
                                opacity = 1
                            } else if (isPrev) {
                                xOffset = -250 // left
                                scale = 0.8
                                zIndex = 5
                                rotateY = 15
                                opacity = 0.6
                            } else if (isNext) {
                                xOffset = 250 // right
                                scale = 0.8
                                zIndex = 5
                                rotateY = -15
                                opacity = 0.6
                            } else if (i < activeIndex) {
                                xOffset = -400
                                opacity = 0
                                zIndex = 1
                            } else if (i > activeIndex) {
                                xOffset = 400
                                opacity = 0
                                zIndex = 1
                            }

                            return (
                                <motion.div
                                    key={i}
                                    animate={{
                                        x: xOffset,
                                        scale: scale,
                                        rotateY: rotateY,
                                        opacity: opacity,
                                        zIndex: zIndex
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20
                                    }}
                                    onClick={() => setActiveIndex(i)}
                                    className={`absolute w-full max-w-[320px] aspect-[4/5] perspective-[1000px] cursor-pointer ${!isActive && opacity > 0 ? 'hover:-translate-y-4 hover:opacity-100 transition-all duration-300' : ''
                                        }`}
                                    style={{ pointerEvents: opacity === 0 ? 'none' : 'auto' }}
                                >
                                    <div className={`w-full h-full p-4 rounded-3xl border border-white/20 shadow-2xl transition-all duration-500 ${isActive ? 'glass-card shadow-[0_30px_60px_rgba(14,165,233,0.3)]' : 'bg-white/5 backdrop-blur-md grayscale-[40%]'
                                        }`}>

                                        <div className="w-full h-[calc(100%-48px)] rounded-2xl overflow-hidden relative">
                                            <img
                                                src={photo.img}
                                                alt={photo.caption}
                                                className="w-full h-full object-cover select-none pointer-events-none"
                                            />
                                            {/* Inner glare */}
                                            <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent mix-blend-overlay ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                        </div>

                                        <div className="h-[48px] flex items-center justify-center">
                                            <p className={`font-script text-2xl tracking-wide ${isActive ? 'text-white' : 'text-white/50'}`}>
                                                {photo.caption}
                                            </p>
                                        </div>

                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* Minimal Controls */}
                <div className="flex gap-4 mt-8">
                    {PHOTOS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx
                                    ? 'w-10 bg-gradient-to-r from-frost-400 to-blush-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                                    : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </div>
    )
}
