import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import GlassCard from '../../../components/ui/GlassCard'
import './CompanySearch.scss'

/**
 * CompanySearch — type any company name or pick a featured one.
 */
export default function CompanySearch({ featured, onSelect }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSelect(query.trim())
  }

  return (
    <div className="company-search">
      <form onSubmit={handleSubmit} className="company-search__form">
        <FiSearch className="company-search__icon" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any company — e.g. Google, Stripe, a startup name..."
        />
        <button type="submit" disabled={!query.trim()}>Search</button>
      </form>

      <p className="company-search__label">Or pick a featured company</p>

      <div className="company-search__grid">
        {featured.map((name, i) => (
          <GlassCard key={name} delay={i * 0.04} className="company-search__card" padding="lg" onClick={() => onSelect(name)}>
            <span className="company-search__avatar">{name[0]}</span>
            <p>{name}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
