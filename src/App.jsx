import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroSection from './components/HeroSection'
import Scene3D from './components/Scene3D'
import LoveCalculator from './components/LoveCalculator'
import CatchMemories from './components/CatchMemories'
import SpinWheel from './components/SpinWheel'
import DreamDateBuilder from './components/DreamDateBuilder'
import PhotoCarousel from './components/PhotoCarousel'
import BirthdayMirror from './components/BirthdayMirror'
import LoveLetter from './components/LoveLetter'
import LoveFact from './components/LoveFact'
import AIChatbot from './components/AIChatbot'
import FloatingHearts from './components/FloatingHearts'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

function App() {
    const lenisRef = useRef(null)
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.8,
            touchMultiplier: 1.5,
        })

        lenisRef.current = lenis

        lenis.on('scroll', (e) => {
            ScrollTrigger.update()
            const progress = e.scroll / (document.body.scrollHeight - window.innerHeight)
            setScrollProgress(Math.min(1, Math.max(0, progress)))
        })

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)

        return () => lenis.destroy()
    }, [])

    return (
        <div className="relative min-h-screen">
            <Scene3D scrollProgress={scrollProgress} />
            <FloatingHearts />

            {/* Scroll progress */}
            <div className="fixed top-0 left-0 w-full h-[3px] z-[100]">
                <div
                    className="h-full rounded-r-full transition-all duration-100"
                    style={{
                        width: `${scrollProgress * 100}%`,
                        background: 'linear-gradient(90deg, #38bdf8, #f472b6, #fbbf24)',
                    }}
                />
            </div>

            <div className="content-layer">
                <HeroSection />

                <section id="letter"><LoveLetter /></section>
                <section id="love-fact"><LoveFact /></section>
                <section id="love-calc"><LoveCalculator /></section>
                <section id="memories"><CatchMemories /></section>
                <section id="spin"><SpinWheel /></section>
                <section id="date-builder"><DreamDateBuilder /></section>
                <section id="photos"><PhotoCarousel /></section>
                <section id="mirror"><BirthdayMirror /></section>
                <section id="chat"><AIChatbot /></section>

                <Footer />
            </div>
        </div>
    )
}

export default App
