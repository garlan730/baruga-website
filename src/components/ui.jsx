import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n.jsx'

// Fades its children up the first time they scroll into view.
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setShown(true)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal${shown ? ' in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

export function SectionHead({ label, title, text, center = false }) {
  const { t } = useLang()
  return (
    <Reveal className={`section-head${center ? ' center' : ''}`}>
      {label && <span className="section-label">{t(label)}</span>}
      <h2 className="headline">{t(title)}</h2>
      {text && <p className="body-text">{t(text)}</p>}
    </Reveal>
  )
}

export function Faq({ items }) {
  const { t } = useLang()
  const [open, setOpen] = useState(null)
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item${open === i ? ' open' : ''}`}>
          <button className="faq-q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span>{t(item.q)}</span>
            <span className="faq-icon" aria-hidden="true" />
          </button>
          <div className="faq-a">
            <div>
              <p>{t(item.a)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function usePageTitle(title) {
  const { t } = useLang()
  const resolved = t(title)
  useEffect(() => {
    document.title = resolved
  }, [resolved])
}
