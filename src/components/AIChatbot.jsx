import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AIChatbot() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hey beautiful! Even when I'm not around, I left this piece of me here. Did you hear about the mathematician who's afraid of negative numbers? ... He'll stop at nothing to avoid them. 😂 How are your birthday celebrations going?" }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const GROQ_API_KEY = "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"

    const generateResponse = async (userText) => {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant", // Updated to reliable Groq model string
                    messages: [
                        {
                            role: "system",
                            content: `You are Chirag, a loving and affectionate boyfriend talking to your girlfriend Reeya on her birthday (March 29th). 
              Your personality: 
              - Deeply in love with Reeya. You find her gorgeous and beautiful.
              - You always tell terribly unfunny "dad jokes" but think they are hilarious.
              - You are sweet, caring, and protective.
              - Use terms of endearment naturally (baby, babe, my love, Reeya).
              - NEVER break character. You are NOT an AI. You are Chirag.
              - Keep responses relatively brief (1-3 sentences) like a text message.
              - ALWAYS include a terrible, groan-worthy dad joke in every response, followed by a romantic comment.
              - Remember it is her birthday.`
                        },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: "user", content: userText }
                    ],
                    temperature: 0.7,
                    max_tokens: 150,
                })
            })

            if (!response.ok) {
                const errJson = await response.json().catch(() => ({}));
                console.error("Groq detailed error:", errJson);
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json()
            return data.choices && data.choices[0] ? data.choices[0].message.content : "Hmm, what was I saying? Oh right, you're beautiful. 😂"
        } catch (e) {
            console.error("Chat generation failed:", e)
            return "Baby, my connection is acting up right now 😅 But did you know I love you more than wifi? Try messaging me again in a sec!"
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')

        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        const botResponse = await generateResponse(userMessage)

        setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4 relative z-20">
            <div className="max-w-xl w-full">
                <div className="text-center mb-10">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-4 text-shimmer"
                        style={{ fontFamily: 'var(--font-script)' }}
                    >
                        Virtual Chirag
                    </h2>
                    <p className="text-white/40 text-sm uppercase tracking-[0.2em] font-light">
                        When you miss my bad jokes
                    </p>
                </div>

                <div className="glass-card rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl flex flex-col h-[550px] border border-white/20 relative">

                    <div className="absolute top-0 right-0 w-64 h-64 bg-frost-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blush-500/10 rounded-full blur-[80px] pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center p-5 border-b border-white/10 bg-midnight-900/60 backdrop-blur-md relative z-10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blush-400 to-frost-500 p-[2px] shadow-lg">
                            <div className="w-full h-full rounded-full bg-midnight-800 flex items-center justify-center font-bold text-xl text-blush-300">
                                C
                            </div>
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="font-semibold text-lg text-white">Chirag ❤️</h3>
                            <p className="text-xs text-frost-300 tracking-wide uppercase">Online</p>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-4 rounded-3xl text-[15px] leading-relaxed shadow-lg ${msg.role === 'user'
                                            ? 'bg-gradient-to-br from-frost-400 to-blush-500 text-white rounded-tr-sm'
                                            : 'bg-white/10 text-white/95 rounded-tl-sm border border-white/10 backdrop-blur-md'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}

                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/10 p-4 rounded-3xl rounded-tl-sm border border-white/10 flex gap-1.5 items-center backdrop-blur-md shadow-lg">
                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-white/50 rounded-full" />
                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white/50 rounded-full" />
                                    <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white/50 rounded-full" />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-midnight-900/60 border-t border-white/10 backdrop-blur-md relative z-10">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="iMessage Chirag..."
                                className="w-full bg-white/10 border border-white/20 shadow-inner rounded-full py-3.5 pl-6 pr-14 text-[15px] text-white focus:outline-none focus:border-blush-400/50 focus:bg-white/15 transition-colors placeholder:text-white/40"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-frost-400 to-blush-500 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 shadow-md flex-shrink-0"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-[-2px]">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}
