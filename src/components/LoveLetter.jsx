import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LoveLetter() {
    const sectionRef = useRef(null)
    const letterRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        gsap.fromTo(letterRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                }
            }
        )
    }, [])

    return (
        <div ref={sectionRef} className="min-h-screen flex items-center justify-center py-24 px-4 relative z-10">
            <div className="max-w-3xl w-full perspective-[1500px] flex flex-col items-center">

                {/* Scroll Ribbon Button */}
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="grouop relative flex flex-col items-center justify-center cursor-pointer mb-8"
                    >
                        <div className="w-32 h-12 bg-gradient-to-r from-red-800 via-red-600 to-red-800 rounded-sm shadow-xl flex items-center justify-center border border-red-900/50">
                            <span className="text-white/90 font-serif tracking-[0.3em] text-xs uppercase z-10">Open Letter</span>
                            <div className="absolute w-[40px] h-[40px] rounded-full bg-red-900/80 shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-amber-500/50 flex items-center justify-center" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <span className="font-script text-amber-200 text-sm">C R</span>
                            </div>
                        </div>
                        <p className="mt-6 text-white/50 tracking-[0.2em] text-sm uppercase font-light">A message for you</p>
                    </motion.button>
                )}

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ rotateX: -90, height: 0, opacity: 0, marginTop: -50 }}
                            animate={{ rotateX: 0, height: 'auto', opacity: 1, marginTop: 0 }}
                            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], transformOrigin: 'top' }}
                            style={{ transformOrigin: 'top center' }}
                            className="w-full relative"
                        >
                            {/* Scroll Top Roller */}
                            <div className="h-6 w-[104%] -ml-[2%] bg-gradient-to-b from-amber-100 to-[#d4af37] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative z-20 border border-amber-600/30" />

                            <div ref={letterRef} className="love-letter p-8 md:p-14 md:text-2xl text-xl leading-relaxed relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                                {/* Faint watermark in background */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
                                    <span style={{ fontSize: '300px', fontFamily: 'var(--font-script)' }}>C&R</span>
                                </div>

                                <div className="relative z-10">
                                    <p className="mb-6 font-bold text-3xl">Dear Reeya,</p>

                                    <p className="mb-5 indent-8">
                                        I am writing this letter with all my feelings that i can express for you, i know that no matter how much i write will be even close to what i want to say to you. Ever since the day that i have met you my life has been a rollercoaster ride, we have seen our up's and down's but we still chose to stick together and that is exactly why we are here.
                                    </p>

                                    <p className="mb-5 indent-8">
                                        Happiest Birthday My Love, this website is nothing but just a little effort that i wanted to show you, i am making this on a very short period of time so please don't mind if something doesn't works or if it isn't looking good. I just want this to be a memory for you to remember for the rest of your life so that even if i am not there to wish you a happy birthday i am still able to through this.
                                    </p>

                                    <p className="mb-8 font-semibold text-rose-800">
                                        I want you to know that in this very moment I Love You the most i've ever loved you. Happy Birthday once again baby.
                                    </p>

                                    <div className="text-right mt-12 pr-4 border-t border-black/10 pt-6">
                                        <p className="text-xl text-black/60 mb-2">Yours Lovingly</p>
                                        <p className="text-4xl font-bold" style={{ color: '#8b1c31' }}>Chirag</p>
                                    </div>
                                </div>
                            </div>

                            {/* Scroll Bottom Roller */}
                            <div className="h-6 w-[104%] -ml-[2%] bg-gradient-to-t from-amber-100 to-[#d4af37] rounded-full shadow-[0_-5px_20px_rgba(0,0,0,0.5)] relative z-20 border border-amber-600/30 -mt-2" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
