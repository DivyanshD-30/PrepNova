import { COMPANIES } from '../landing.data'
import './Companies.scss'

export default function Companies() {
  return (
    <section className="companies">
      <p className="companies__label container">
        Trusted by candidates who landed roles at
      </p>

      <div className="companies__marquee">
        <div className="companies__track">
          {[...COMPANIES, ...COMPANIES].map((name, i) => (
            <span className="companies__item" key={`${name}-${i}`}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
