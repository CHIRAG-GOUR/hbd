import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
    const footerRef = useRef(null)

    useEffect(() => {
        gsap.fromTo('.footer-text',
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                stagger: 0.2,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 80%',
                }
            }
        )
    }, [])

    return (
        <footer ref={footerRef} className="relative py-24 px-4 overflow-hidden border-t border-white/5 mt-20">
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-700 via-midnight-800 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">

                {/* Minimal Animated Ring */}
                <div className="flex justify-center mb-10">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 rounded-full border border-blush-400/30 border-t-blush-400"
                        />
                        <div className="w-2 h-2 rounded-full bg-frost-300 shadow-[0_0_10px_#d4b4fe]" />
                    </div>
                </div>

                <h2
                    className="footer-text text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blush-300 to-frost-300 mb-6"
                    style={{ fontFamily: 'var(--font-script)' }}
                >
                    Happy Birthday, Reeya
                </h2>

                <p className="footer-text text-white/50 text-base mb-2 max-w-md mx-auto leading-relaxed font-light">
                    Every line of code and every pixel here was crafted just for you,
                    because ordinary gifts aren't enough for an extraordinary girl.
                </p>

                <div className="footer-text mt-16 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4">
                    <p className="text-white/30 text-xs tracking-[0.3em] uppercase">
                        Designed with infinite love
                    </p>
                    <p className="text-blush-400/60 font-script italic text-xl">
                        — Chirag
                    </p>
                </div>
            </div>
        </footer>
    )
}
