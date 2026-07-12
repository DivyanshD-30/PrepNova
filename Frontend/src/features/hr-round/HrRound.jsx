import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FiSend, FiRotateCcw } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import { useToast } from '../../components/ui/Toast'
import RoleSelector from './components/RoleSelector'
import HrChatBubble from './components/HrChatBubble'
import ConfidenceScoreCard from './components/ConfidenceScoreCard'
import { startSession, sendMessage } from './services/hrRound.api'
import './HrRound.scss'

/**
 * HrRound — conversational HR-round simulator with a confidence score and
 * an emotion-analysis placeholder (text-only tone heuristic).
 *
 * @backend POST /api/hr-round/session
 * @backend POST /api/hr-round/session/:id/message
 * @backend GET  /api/hr-round/session/:id
 */
export default function HrRound() {
  const toast = useToast()
  const [sessionId, setSessionId] = useState(null)
  const [role, setRole] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const [sessionDone, setSessionDone] = useState(false)
  const [confidenceScore, setConfidenceScore] = useState(null)
  const [summary, setSummary] = useState(null)
  const [starting, setStarting] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, aiTyping])

  const handleStart = async (selectedRole) => {
    setStarting(true)
    try {
      const data = await startSession(selectedRole)
      setSessionId(data.session.id)
      setRole(data.session.role)
      setMessages(data.session.messages)
      setSessionDone(false)
      setConfidenceScore(null)
      setSummary(null)
    } catch (err) {
      console.error('startSession error:', err)
      toast.error('Could not start the HR round. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || aiTyping || sessionDone) return

    const userText = input.trim()
    setInput('')
    setAiTyping(true)

    try {
      const data = await sendMessage(sessionId, userText)

      setMessages((prev) => [
        ...prev,
        { role: 'user', text: userText, detectedTone: data.detectedTone },
        { role: 'ai', text: data.reply, detectedTone: null },
      ])

      if (data.done) {
        setSessionDone(true)
        setConfidenceScore(data.confidenceScore)
        setSummary(data.summary)
        toast.success('HR round complete!')
      }
    } catch (err) {
      console.error('sendMessage error:', err)
      toast.error(err?.response?.data?.message || 'Could not send your message.')
    } finally {
      setAiTyping(false)
    }
  }

  const handleRestart = () => {
    setSessionId(null)
    setRole('')
    setMessages([])
    setSessionDone(false)
    setConfidenceScore(null)
    setSummary(null)
  }

  return (
    <div>
      <PageHeader
        eyebrow="HR Round"
        title="Practice your HR interview"
        description="A conversational HR-round simulator covering motivation, fit, and soft skills — with a confidence read at the end."
        actions={
          sessionId && (
            <Button variant="ghost" size="sm" icon={<FiRotateCcw />} onClick={handleRestart}>
              New session
            </Button>
          )
        }
      />

      {!sessionId ? (
        <RoleSelector onStart={handleStart} loading={starting} />
      ) : (
        <div className="hr-round">
          <GlassCard padding="none" hoverable={false} className="hr-round__chat-card">
            <div className="hr-round__chat-header">
              <span className="hr-round__live-dot" />
              <p>HR Round &bull; {role}</p>
            </div>

            <div className="hr-round__messages" ref={scrollRef}>
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <HrChatBubble
                    key={i}
                    role={m.role}
                    text={m.text}
                    detectedTone={m.detectedTone}
                    animateTyping={m.role === 'ai' && i === messages.length - 1}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="hr-round__composer">
              {sessionDone ? (
                <p className="hr-round__done-note">This session is complete. See your confidence score below.</p>
              ) : (
                <>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your answer..."
                    disabled={aiTyping}
                  />
                  <Button variant="primary" size="md" icon={<FiSend />} onClick={handleSend} disabled={!input.trim() || aiTyping}>
                    Send
                  </Button>
                </>
              )}
            </div>
          </GlassCard>

          {sessionDone && confidenceScore != null && (
            <ConfidenceScoreCard confidenceScore={confidenceScore} summary={summary} />
          )}
        </div>
      )}
    </div>
  )
}
