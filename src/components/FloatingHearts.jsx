import { useEffect, useRef } from 'react'

export default function FloatingHearts() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        let animId
        let particles = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        class Heart {
            constructor() {
                this.reset()
            }
            reset() {
                this.x = Math.random() * canvas.width
                this.y = canvas.height + 20
                this.size = Math.random() * 12 + 6
                this.speedY = Math.random() * 0.6 + 0.2
                this.speedX = Math.random() * 0.4 - 0.2
                this.opacity = Math.random() * 0.3 + 0.1
                this.rotation = Math.random() * Math.PI * 2
                this.rotSpeed = (Math.random() - 0.5) * 0.02
                this.hue = Math.random() * 40 + 330 // Pink-red range
            }
            update() {
                this.y -= this.speedY
                this.x += this.speedX + Math.sin(this.y * 0.005) * 0.3
                this.rotation += this.rotSpeed
                if (this.y < -20) this.reset()
            }
            draw() {
                ctx.save()
                ctx.translate(this.x, this.y)
                ctx.rotate(this.rotation)
                ctx.globalAlpha = this.opacity
                ctx.fillStyle = `hsla(${this.hue}, 80%, 65%, 1)`
                ctx.beginPath()
                const s = this.size
                ctx.moveTo(0, s * 0.3)
                ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.1, 0, s)
                ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.3, 0, s * 0.3)
                ctx.fill()
                ctx.restore()
            }
        }

        class Sparkle {
            constructor() {
                this.reset()
            }
            reset() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 2 + 1
                this.life = 0
                this.maxLife = Math.random() * 120 + 60
                this.opacity = 0
            }
            update() {
                this.life++
                const progress = this.life / this.maxLife
                this.opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2
                if (this.life >= this.maxLife) this.reset()
            }
            draw() {
                ctx.save()
                ctx.globalAlpha = this.opacity * 0.6
                ctx.fillStyle = '#ffd700'
                ctx.shadowBlur = 10
                ctx.shadowColor = '#ffd700'
                ctx.beginPath()
                // Star shape
                const spikes = 4
                const outerRadius = this.size
                const innerRadius = this.size * 0.4
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius
                    const angle = (i * Math.PI) / spikes - Math.PI / 2
                    if (i === 0) ctx.moveTo(this.x + Math.cos(angle) * radius, this.y + Math.sin(angle) * radius)
                    else ctx.lineTo(this.x + Math.cos(angle) * radius, this.y + Math.sin(angle) * radius)
                }
                ctx.closePath()
                ctx.fill()
                ctx.restore()
            }
        }

        // Create particles
        for (let i = 0; i < 15; i++) {
            const h = new Heart()
            h.y = Math.random() * canvas.height
            particles.push(h)
        }
        for (let i = 0; i < 25; i++) {
            particles.push(new Sparkle())
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach(p => {
                p.update()
                p.draw()
            })
            animId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[1] pointer-events-none"
            style={{ opacity: 0.7 }}
        />
    )
}
