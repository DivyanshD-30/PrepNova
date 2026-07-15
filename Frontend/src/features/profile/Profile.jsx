import { useEffect, useState } from 'react'
import { FiUser, FiLock, FiZap, FiAward } from 'react-icons/fi'
import PageHeader from '../../components/ui/PageHeader'
import GlassCard from '../../components/ui/GlassCard'
import Button from '../../components/ui/Button'
import ErrorState from '../../components/ui/ErrorState'
import { SkeletonGrid } from '../../components/ui/Skeleton'
import { useToast } from '../../components/ui/Toast'
import { getProfile, updateProfile, changePassword } from './services/profile.api'
import './Profile.scss'

export default function Profile() {
  const toast = useToast()
  const [status, setStatus] = useState('loading')
  const [profile, setProfile] = useState(null)
  const [username, setUsername] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [savingPwd, setSavingPwd] = useState(false)

  const load = async () => {
    setStatus('loading')
    try {
      const data = await getProfile()
      setProfile(data.profile)
      setUsername(data.profile.username)
      setStatus('ready')
    } catch { setStatus('error') }
  }

  useEffect(() => { load() }, [])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const data = await updateProfile({ username })
      setProfile(prev => ({ ...prev, username: data.user.username }))
      toast.success('Profile updated.')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not update profile.')
    } finally { setSavingProfile(false) }
  }

  const handleChangePassword = async () => {
    if (pwd.next !== pwd.confirm) { toast.error('New passwords do not match.'); return }
    if (pwd.next.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    setSavingPwd(true)
    try {
      await changePassword({ currentPassword: pwd.current, newPassword: pwd.next })
      toast.success('Password changed.')
      setPwd({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not change password.')
    } finally { setSavingPwd(false) }
  }

  const xpPct = profile ? Math.round(((profile.stats.xp % 500) / 500) * 100) : 0

  return (
    <div>
      <PageHeader eyebrow="Profile" title="Your account" description="Manage your details, stats, and security settings." />
      {status === 'loading' && <SkeletonGrid count={4} />}
      {status === 'error' && <ErrorState onRetry={load} />}
      {status === 'ready' && profile && (
        <div className="profile">
          <div className="profile__stats-row">
            {[
              { label: 'Level', value: profile.stats.level, icon: <FiAward /> },
              { label: 'XP', value: profile.stats.xp, icon: <FiZap /> },
              { label: 'Reports', value: profile.stats.totalInterviews, icon: <FiUser /> },
              { label: 'Sessions', value: profile.stats.totalPractice, icon: <FiUser /> },
            ].map(s => (
              <GlassCard key={s.label} padding="md" hoverable={false} className="profile__stat">
                <span className="profile__stat-icon">{s.icon}</span>
                <p className="profile__stat-value">{s.value}</p>
                <p className="profile__stat-label">{s.label}</p>
              </GlassCard>
            ))}
          </div>

          <div className="profile__xp-bar-wrap">
            <div className="profile__xp-label"><FiZap /> Level {profile.stats.level} — {profile.stats.xp} / {profile.stats.nextLevelXp} XP</div>
            <div className="profile__xp-bg"><div className="profile__xp-fill" style={{ width: `${xpPct}%` }} /></div>
          </div>

          <div className="profile__grid">
            <GlassCard padding="lg" hoverable={false}>
              <h3 className="profile__section-title"><FiUser /> Profile Details</h3>
              <div className="profile__field">
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} className="profile__input" />
              </div>
              <div className="profile__field">
                <label>Email</label>
                <input value={profile.email} className="profile__input profile__input--disabled" disabled />
              </div>
              <Button variant="primary" size="md" loading={savingProfile} onClick={handleSaveProfile}>Save Changes</Button>
            </GlassCard>

            <GlassCard padding="lg" hoverable={false}>
              <h3 className="profile__section-title"><FiLock /> Change Password</h3>
              {[['Current password', 'current'], ['New password', 'next'], ['Confirm new password', 'confirm']].map(([label, key]) => (
                <div key={key} className="profile__field">
                  <label>{label}</label>
                  <input type="password" value={pwd[key]} onChange={e => setPwd(p => ({ ...p, [key]: e.target.value }))} className="profile__input" placeholder="••••••••" />
                </div>
              ))}
              <Button variant="primary" size="md" loading={savingPwd} onClick={handleChangePassword}>Update Password</Button>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  )
}
