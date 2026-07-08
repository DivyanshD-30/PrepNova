import { Link } from 'react-router'
import { FiZap, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi'
import './Footer.scss'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'AI Interview Generator', href: '#features' },
      { label: 'Resume Analyzer', href: '#features' },
      { label: 'Mock Video Interview', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Interview Library', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand-col">
            <Link to="/" className="footer__brand">
              <span className="footer__brand-icon"><FiZap /></span>
              <span className="footer__brand-text">PrepNova</span>
            </Link>
            <p className="footer__tagline">
              The AI interview preparation platform that gets you hired faster.
            </p>
            <div className="footer__socials">
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" aria-label="GitHub"><FiGithub /></a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div className="footer__col" key={col.title}>
              <p className="footer__col-title">{col.title}</p>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} PrepNova. All rights reserved.</p>
          <p className="footer__made">Built for ambitious job seekers, everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
