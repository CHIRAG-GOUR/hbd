import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BirthdayMirror() {
    const [cameraActive, setCameraActive] = useState(false)
    const [faceDetected, setFaceDetected] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const overlayCanvasRef = useRef(null)
    const animRef = useRef(null)
    const sectionRef = useRef(null)
    const streamRef = useRef(null)
    const faceApiLoadedRef = useRef(false)

    // Sparkles array ref
    const effectsRef = useRef({ sparkles: [], frames: 0 })

    useEffect(() => {
        gsap.fromTo(sectionRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                }
            }
        )
        return () => stopCamera()
    }, [])

    const loadFaceApi = async () => {
        if (faceApiLoadedRef.current) return true
        try {
            // Using dynamic import so it doesn't block initial page load
            const faceapi = await import('face-api.js')
            const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model'

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                // Just using tiny face detector for performance and simplicity
            ])

            window.faceapi = faceapi
            faceApiLoadedRef.current = true
            return true
        } catch (err) {
            console.warn('Face API load error, falling back to static overlay:', err)
            return false
        }
    }

    const initEffects = (w, h) => {
        const sparkles = []
        for (let i = 0; i < 40; i++) {
            sparkles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                s: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                life: Math.random() * 100,
                hue: Math.random() > 0.5 ? 340 : 45 // pink or gold
            })
        }
        effectsRef.current.sparkles = sparkles
    }

    const startCamera = async () => {
        setLoading(true)
        setError(null)

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
            })

            setCameraActive(true) // Render the video element

            // Wait for React to render the DOM
            let video = null
            for (let i = 0; i < 20; i++) {
                await new Promise(resolve => setTimeout(resolve, 50))
                if (videoRef.current) {
                    video = videoRef.current
                    break
                }
            }

            if (!video) throw new Error("Video element not found after mounting")

            streamRef.current = stream
            video.srcObject = stream

            // Crucial: Wait for video to actually be playing and have dimensions
            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play().then(resolve).catch(e => {
                        console.error("Play error:", e)
                        resolve()
                    })
                }
            })

            const useFaceApi = await loadFaceApi()
            const w = video.videoWidth || 640
            const h = video.videoHeight || 480

            initEffects(w, h)
            renderLoop(useFaceApi, w, h)

        } catch (err) {
            console.error('Camera error:', err)
            setError(
                err.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow permissions in your browser settings.'
                    : 'Could not access camera. Make sure no other app is using it.'
            )
            setCameraActive(false)
        } finally {
            setLoading(false)
        }
    }

    const renderLoop = (useFaceApi, w, h) => {
        const video = videoRef.current
        const canvas = canvasRef.current
        const overlay = overlayCanvasRef.current
        if (!video || !canvas || !overlay) return

        const ctx = canvas.getContext('2d', { alpha: false }) // Optimize
        const octx = overlay.getContext('2d')

        canvas.width = w
        canvas.height = h
        overlay.width = w
        overlay.height = h

        let detectCounter = 0
        let lastBox = null

        const render = async () => {
            if (!video || video.paused || video.ended || video.readyState < 2) {
                // Keep requesting frame even if video isn't ready yet to avoid loop death
                animRef.current = requestAnimationFrame(render)
                return
            }

            // Draw mirrored video with a slight aesthetic tint
            ctx.save()
            ctx.translate(w, 0)
            ctx.scale(-1, 1)
            ctx.drawImage(video, 0, 0, w, h)
            ctx.restore()

            // Warm glass overlay
            ctx.fillStyle = 'rgba(255, 126, 163, 0.05)'
            ctx.fillRect(0, 0, w, h)

            octx.clearRect(0, 0, w, h)
            effectsRef.current.frames++

            // Hardware accelerated face detection (every 6 frames instead of every frame)
            if (useFaceApi && window.faceapi && detectCounter % 6 === 0) {
                try {
                    const detections = await window.faceapi.detectAllFaces(
                        video,
                        new window.faceapi.TinyFaceDetectorOptions({ inputSize: 160 }) // smaller input for speed
                    )

                    if (detections.length > 0) {
                        setFaceDetected(true)
                        const box = detections[0].box
                        // Smooth lerp box position
                        if (!lastBox) lastBox = box
                        else {
                            lastBox.x += (box.x - lastBox.x) * 0.4
                            lastBox.y += (box.y - lastBox.y) * 0.4
                            lastBox.width += (box.width - lastBox.width) * 0.4
                            lastBox.height += (box.height - lastBox.height) * 0.4
                        }
                    } else {
                        setFaceDetected(false)
                    }
                } catch (e) { /* ignore single frame errors */ }
            }

            detectCounter++

            // Draw hat and text via Canvas API directly for performance
            const centerX = useFaceApi && lastBox ? (w - lastBox.x - lastBox.width / 2) : w / 2
            const hatY = useFaceApi && lastBox ? lastBox.y - (lastBox.height * 0.25) : h * 0.2
            const hatW = useFaceApi && lastBox ? lastBox.width * 0.9 : 120
            const hatH = useFaceApi && lastBox ? lastBox.height * 0.9 : 120

            // Only draw if we have a face or if we're in fallback mode
            if ((useFaceApi && faceDetected) || !useFaceApi) {
                // Draw Hat (Skeuomorphic style)
                octx.save()

                // Hat shadow
                octx.shadowColor = 'rgba(0,0,0,0.5)'
                octx.shadowBlur = 15
                octx.shadowOffsetY = 10

                // Cone
                const grad = octx.createLinearGradient(centerX - hatW / 2, hatY, centerX + hatW / 2, hatY)
                grad.addColorStop(0, '#ff4d7e')
                grad.addColorStop(0.5, '#c084fc')
                grad.addColorStop(1, '#ff4d7e')

                octx.beginPath()
                octx.moveTo(centerX - hatW / 2, hatY)
                octx.lineTo(centerX, hatY - hatH)
                octx.lineTo(centerX + hatW / 2, hatY)
                octx.closePath()
                octx.fillStyle = grad
                octx.fill()

                octx.shadowColor = 'transparent' // Reset shadow for internal details

                // Gold Rim
                octx.beginPath()
                octx.ellipse(centerX, hatY, hatW / 2 + 5, hatH * 0.1, 0, 0, Math.PI * 2)
                octx.fillStyle = '#fcd34d'
                octx.fill()

                // Pom Pom
                octx.beginPath()
                octx.arc(centerX, hatY - hatH, hatW * 0.15, 0, Math.PI * 2)
                const pomGrad = octx.createRadialGradient(centerX - 3, hatY - hatH - 3, 2, centerX, hatY - hatH, hatW * 0.15)
                pomGrad.addColorStop(0, '#ffffff')
                pomGrad.addColorStop(1, '#e4d0ff')
                octx.fillStyle = pomGrad
                octx.fill()

                octx.restore()

                // Happy Birthday Text
                octx.save()
                octx.font = `bold ${Math.max(24, hatW * 0.3)}px 'Dancing Script', cursive`
                octx.textAlign = 'center'
                octx.shadowColor = 'rgba(255, 77, 126, 0.8)'
                octx.shadowBlur = 20
                octx.fillStyle = '#ffffff'
                // Bounce animation
                const bounce = Math.sin(effectsRef.current.frames * 0.05) * 5
                octx.fillText('Happy Birthday!', centerX, hatY - hatH - 30 + bounce)
                octx.restore()
            }

            // Draw Sparkles Overlay
            octx.save()
            octx.globalCompositeOperation = 'screen'
            effectsRef.current.sparkles.forEach(s => {
                s.x += s.vx
                s.y += s.vy
                s.life++
                if (s.life > 100 || s.x < 0 || s.x > w || s.y < 0 || s.y > h) {
                    s.x = Math.random() * w
                    s.y = Math.random() * h
                    s.life = 0
                }

                const opacity = Math.sin((s.life / 100) * Math.PI)
                octx.globalAlpha = opacity * 0.8

                // Draw 4 point star
                octx.fillStyle = `hsl(${s.hue}, 90%, 75%)`
                octx.beginPath()
                octx.ellipse(s.x, s.y, s.s * 2, s.s / 2, 0, 0, Math.PI * 2)
                octx.fill()
                octx.beginPath()
                octx.ellipse(s.x, s.y, s.s / 2, s.s * 2, 0, 0, Math.PI * 2)
                octx.fill()

                octx.globalAlpha = opacity
                octx.fillStyle = '#fff'
                octx.beginPath()
                octx.arc(s.x, s.y, s.s / 2, 0, Math.PI * 2)
                octx.fill()
            })
            octx.restore()

            // Vignette border
            const vGrad = octx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.8)
            vGrad.addColorStop(0, 'rgba(0,0,0,0)')
            vGrad.addColorStop(1, 'rgba(13, 5, 21, 0.4)')
            octx.fillStyle = vGrad
            octx.fillRect(0, 0, w, h)

            animRef.current = requestAnimationFrame(render)
        }

        render()
    }

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop())
            streamRef.current = null
        }
        if (animRef.current) {
            cancelAnimationFrame(animRef.current)
            animRef.current = null
        }
        setCameraActive(false)
        setFaceDetected(false)
    }

    const takeScreenshot = () => {
        const canvas = canvasRef.current
        const overlay = overlayCanvasRef.current
        if (!canvas || !overlay) return

        const combined = document.createElement('canvas')
        combined.width = canvas.width
        combined.height = canvas.height
        const cctx = combined.getContext('2d')

        // Draw background
        cctx.drawImage(canvas, 0, 0)
        // Draw hat/sparkles
        cctx.drawImage(overlay, 0, 0)

        // Add watermark
        cctx.fillStyle = 'rgba(255,255,255,0.8)'
        cctx.font = "20px 'Dancing Script'"
        cctx.fillText("Reeya's Magical Birthday", 20, combined.height - 20)

        const link = document.createElement('a')
        link.download = `reeya-birthday-${Date.now()}.png`
        link.href = combined.toDataURL('image/png', 0.9)
        link.click()
    }

    return (
        <div ref={sectionRef} className="min-h-screen flex items-center justify-center py-24 px-4">
            <div className="max-w-3xl w-full">
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl md:text-6xl font-bold mb-4 text-shimmer"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        The Magical Mirror
                    </h2>
                    <p className="text-white/40 text-sm uppercase tracking-[0.2em] font-light">
                        A reflection of beauty
                    </p>
                </div>

                <div className="glass-card rounded-[2rem] p-6 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">

                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blush-400/50 to-transparent" />

                    {!cameraActive ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <p className="text-white/70 mb-8 max-w-sm font-light leading-relaxed">
                                Step up to the mirror to reveal your magical birthday crown. A little digital magic just for you.
                            </p>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-6 py-3 rounded-xl mb-8 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={startCamera}
                                disabled={loading}
                                className="skeu-btn px-12 tracking-widest"
                            >
                                {loading ? 'AWAKENING MIRROR...' : 'STEP IN FRONT'}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full">
                            {/* Glass Frame wrapper */}
                            <div className="relative w-full max-w-[640px] rounded-[2rem] overflow-hidden p-3 bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                                <div className="relative rounded-2xl bg-black aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
                                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none" playsInline autoPlay muted />
                                    {/* The actual video render target */}
                                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
                                    {/* The hat and effects overlay */}
                                    <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

                                    {/* UI Overlay */}
                                    <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-50">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border backdrop-blur-md shadow-lg transition-colors ${faceDetected
                                            ? 'bg-blush-500/20 text-blush-100 border-blush-400/30'
                                            : 'bg-black/60 text-white/50 border-white/10'
                                            }`}>
                                            {faceDetected ? 'Magic Applied' : 'Looking for you...'}
                                        </div>
                                        {faceDetected && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="px-4 py-2 mt-2 rounded-xl bg-gradient-to-r from-blush-500/80 to-purple-500/80 text-white shadow-[0_0_20px_rgba(255,77,126,0.5)] border border-white/20 text-sm font-bold tracking-widest uppercase"
                                                style={{ fontFamily: 'var(--font-outfit)' }}
                                            >
                                                You Look Gorgeous, Birthday Girl! ✨
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex justify-center flex-wrap gap-4 mt-8 w-full">
                                <button
                                    onClick={stopCamera}
                                    className="px-8 py-3 rounded-2xl border border-white/20 text-white/60 hover:bg-white/10 hover:text-white transition-all text-xs tracking-widest uppercase font-semibold"
                                >
                                    Step Away
                                </button>
                                <button
                                    onClick={takeScreenshot}
                                    className="skeu-btn px-8 py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-2 font-semibold"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                    Capture
                                </button>
                            </div>

                            <p className="text-white/30 text-[10px] mt-8 font-light tracking-wider uppercase text-center">
                                Processed entirely on your device. Privacy respected.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
