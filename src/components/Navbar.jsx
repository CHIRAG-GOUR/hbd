import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sections = [
    { id: 'hero', name: 'Top' },
    { id: 'letter', name: 'Letter' },
    { id: 'love-fact', name: 'March 29' },
    { id: 'love-calc', name: 'Calculator' },
    { id: 'memories', name: 'Memories' },
    { id: 'spin', name: 'Spin' },
    { id: 'date-builder', name: 'Date' },
    { id: 'photos', name: 'Gallery' },
    { id: 'mirror', name: 'Mirror' },
    { id: 'chat', name: 'Chat' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = (id) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        setIsOpen(false)
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'frost' : 'glass'
                } rounded-full px-2 py-2`}
        >
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
                {sections.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => scrollTo(s.id)}
                        className="group relative px-4 py-2 rounded-full text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:bg-white/10"
                    >
                        <span>{s.name}</span>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-blush-400 to-frost-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                    </button>
                ))}
            </div>

            {/* Mobile Toggle */}
            <div className="flex lg:hidden items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="px-6 py-2 text-white/90 font-medium text-sm flex items-center gap-2"
                >
                    <span>Menu</span>
                    <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[10px]"
                    >
                        ▼
                    </motion.span>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="lg:hidden absolute top-full left-0 right-0 mt-3 frost rounded-2xl overflow-hidden min-w-[200px]"
                    >
                        <div className="py-2">
                            {sections.map((s, i) => (
                                <motion.button
                                    key={s.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => scrollTo(s.id)}
                                    className="w-full px-6 py-3 text-left text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    {s.name}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
