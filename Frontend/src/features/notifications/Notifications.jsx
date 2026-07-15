import { useEffect, useState } from 'react'
import { FiBell, FiCheckCircle } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getNotifications, markRead, markAllRead } from './services/notifications.api'
import './Notifications.scss'

const TYPE_VARIANT = { reminder: 'warning', streak: 'success', achievement: 'primary', platform: 'default' }

export default function Notifications() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const load = async () => {
    setStatus('loading')
    try {
      const data = await getNotifications()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
      setStatus('ready')
    } catch { setStatus('error') }
  }

  useEffect(() => { load() }, [])

  const handleRead = async (id) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
    setUnreadCount(c => Math.max(0, c - 1))
    try { await markRead(id) } catch { toast.error('Could not mark as read.') }
  }

  const handleReadAll = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    try { await markAllRead() } catch { toast.error('Could not mark all as read.') }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Notifications"
        title="Notification centre"
        description="Reminders, streaks, and platform updates."
        actions={unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={<FiCheckCircle />} onClick={handleReadAll}>
            Mark all read
          </Button>
        )}
      />
      {status === 'loading' && <SkeletonGrid count={4} />}
      {status === 'error' && <ErrorState onRetry={load} />}
      {status === 'ready' && (
        <div className="notifications">
          {notifications.length === 0 && (
            <GlassCard padding="lg" hoverable={false} className="notifications__empty">
              <FiBell style={{ fontSize: 32, color: 'var(--text-muted)', marginBottom: 8 }} />
              <p>No notifications yet.</p>
            </GlassCard>
          )}
          {notifications.map(n => (
            <GlassCard
              key={n._id}
              padding="md"
              hoverable
              className={`notifications__item ${!n.read ? 'notifications__item--unread' : ''}`}
              onClick={() => !n.read && handleRead(n._id)}
            >
              <div className="notifications__item-header">
                <div className="notifications__item-title-row">
                  {!n.read && <span className="notifications__dot" />}
                  <p className="notifications__title">{n.title}</p>
                </div>
                <Badge variant={TYPE_VARIANT[n.type]}>{n.type}</Badge>
              </div>
              <p className="notifications__message">{n.message}</p>
              <p className="notifications__time">{new Date(n.createdAt).toLocaleString()}</p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
