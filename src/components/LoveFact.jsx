import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LoveFact() {
    const sectionRef = useRef(null)
    const contentRef = useRef(null)
    const numberRef = useRef(null)

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
            }
        })

        tl.fromTo(numberRef.current,
            { opacity: 0, scale: 0.5, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.7)" }
        ).fromTo(contentRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            "-=0.8"
        )
    }, [])

    return (
        <div ref={sectionRef} className="min-h-[80vh] flex items-center justify-center py-20 px-4">
            <div className="max-w-4xl w-full relative">
                {/* Background glow specific to this component */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-frost-500/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="glass-card rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden backdrop-blur-3xl border border-white/20">

                    <div ref={numberRef} className="mb-6">
                        <span className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-frost-300 to-blush-400 opacity-90 leading-none tracking-tighter">
                            29
                        </span>
                        <span className="block text-xl md:text-3xl uppercase tracking-[0.5em] text-white/50 mt-2 font-light">
                            March
                        </span>
                    </div>

                    <div ref={contentRef}>
                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto mb-8" />

                        <h3 className="text-2xl md:text-4xl font-semibold mb-6 text-glow text-center" style={{ fontFamily: 'var(--font-script)', color: '#ffb6c1' }}>
                            The alignment of the stars
                        </h3>

                        <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto font-light text-center">
                            March 29th is a day woven into the fabric of the universe just for us. It is the day the world was gifted with the most beautiful soul. Every year, on this exact day, the universe pauses to celebrate the light you bring into my life, Reeya.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
