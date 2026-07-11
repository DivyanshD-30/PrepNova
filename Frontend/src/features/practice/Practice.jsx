import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FiSend, FiRotateCcw } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import GlassCard from '../../components/ui/GlassCard'
import { useToast } from '../../components/ui/Toast'
import TopicPicker from './components/TopicPicker'
import ChatBubble from './components/ChatBubble'
import TypingIndicator from './components/TypingIndicator'
import ProgressTracker from './components/ProgressTracker'
import VoiceModeToggle from './components/VoiceModeToggle'
import { PRACTICE_TOPICS } from './practice.data'
import { startSession, sendMessage } from './services/practice.api'
import './Practice.scss'

const SESSION_LENGTH = 6

export default function Practice() {
  const toast = useToast()
  const [topic, setTopic] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const [inputMode, setInputMode] = useState('text')
  const [sessionDone, setSessionDone] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: SESSION_LENGTH })
  const scrollRef = useRef(null)

  const topicLabel = PRACTICE_TOPICS.find((t) => t.id === topic)?.label || ''

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, aiTyping])

  const handleStart = async (selectedTopic) => {
    setTopic(selectedTopic)
    setSessionDone(false)
    setMessages([])
    setAiTyping(true)
    try {
      const data = await startSession(selectedTopic)
      const firstMsg = data.session.messages[0]
      setSessionId(data.session.id)
      setMessages([{ role: 'ai', text: firstMsg.text, id: crypto.randomUUID() }])
    } catch (err) {
      toast.error('Could not start session. Please try again.')
      setTopic(null)
    } finally {
      setAiTyping(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || aiTyping || sessionDone) return

    const userMsg = { role: 'user', text: input.trim(), id: crypto.randomUUID() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setAiTyping(true)

    try {
      const data = await sendMessage(sessionId, userMsg.text)
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply, id: crypto.randomUUID() }])
      setProgress(data.progress)
      if (data.done) {
        setSessionDone(true)
        toast.success('Practice session complete! Great work.')
      }
    } catch (err) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setAiTyping(false)
    }
  }

  const handleRestart = () => {
    setTopic(null)
    setSessionId(null)
    setMessages([])
    setSessionDone(false)
    setProgress({ current: 0, total: SESSION_LENGTH })
  }

  return (
    <div>
      <PageHeader
        eyebrow="Practice Interview"
        title="Practice with your AI interviewer"
        description="A live, ChatGPT-style mock interview that adapts to your answers in real time."
        actions={
          topic && (
            <Button variant="ghost" size="sm" icon={<FiRotateCcw />} onClick={handleRestart}>
              Restart
            </Button>
          )
        }
      />

      {!topic ? (
        <TopicPicker onStart={handleStart} />
      ) : (
        <div className="practice">
          <GlassCard padding="none" hoverable={false} className="practice__chat-card">
            <div className="practice__chat-header">
              <div className="practice__chat-header-left">
                <span className="practice__live-dot" />
                <p>Live mock interview &bull; {topicLabel}</p>
              </div>
              <VoiceModeToggle mode={inputMode} onChange={setInputMode} />
            </div>

            <div className="practice__messages" ref={scrollRef}>
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <ChatBubble
                    key={m.id}
                    role={m.role}
                    text={m.text}
                    animateTyping={m.role === 'ai' && i === messages.length - 1}
                  />
                ))}
                {aiTyping && <TypingIndicator key="typing" />}
              </AnimatePresence>
            </div>

            <div className="practice__composer">
              {sessionDone ? (
                <p className="practice__done-note">
                  This session is complete. Restart to try another topic, or review your summary on the right.
                </p>
              ) : (
                <>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={inputMode === 'voice' ? 'Listening... (voice mode is a UI preview)' : 'Type your answer...'}
                    disabled={aiTyping}
                  />
                  <Button variant="primary" size="md" icon={<FiSend />} onClick={handleSend} disabled={!input.trim() || aiTyping}>
                    Send
                  </Button>
                </>
              )}
            </div>
          </GlassCard>

          <div className="practice__sidebar">
            <ProgressTracker current={progress.current} total={progress.total} topic={topicLabel} />

            <GlassCard padding="lg" hoverable={false}>
              <h3 className="practice__tips-title">Interview Tips</h3>
              <ul className="practice__tips-list">
                <li>Use the STAR method for behavioral questions.</li>
                <li>Think out loud — interviewers value your process.</li>
                <li>It's okay to ask clarifying questions first.</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  )
}
