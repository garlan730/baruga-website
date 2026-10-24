import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n.jsx'

const NAV = [
  { to: '/#treatments', label: { id: 'Perawatan', en: 'Treatments' } },
  { to: '/vaksin-umroh', label: { id: 'Vaksin Umroh & Haji', en: 'Umrah & Hajj Vaccine' } },
  { to: '/#doctors', label: { id: 'Tim Dokter', en: 'Our Doctors' } },
  { to: '/#results', label: { id: 'Hasil', en: 'Results' } },
  { to: '/#faq', label: { id: 'FAQ', en: 'FAQ' } },
  { to: '/#contact', label: { id: 'Kontak', en: 'Contact' } },
]

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {['id', 'en'].map((l) => (
        <button key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)} aria-pressed={lang === l}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default function Header() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header className={`header${scrolled || pathname !== '/' ? ' scrolled' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="Baruga Medical Center">
            <img src="/img/logo.png" alt="Baruga Medical Center" />
          </Link>

          <nav className="nav-desktop">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={`nav-link${n.to === pathname ? ' current' : ''}`}>
                {t(n.label)}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <LangToggle />
            <Link to="/#contact" className="btn btn-primary btn-sm header-cta">
              {t({ id: 'Buat Janji', en: 'Book Now' })}
            </Link>
            <button className={`mobile-toggle${open ? ' active' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed overlay inside the header box. */}
      <div className={`mobile-menu${open ? ' active' : ''}`} onClick={() => setOpen(false)}>
        {NAV.map((n) => (
          <Link key={n.to} to={n.to}>
            {t(n.label)}
          </Link>
        ))}
        <Link to="/#contact" className="btn btn-primary">
          {t({ id: 'Buat Janji Konsultasi', en: 'Book a Consultation' })}
        </Link>
      </div>
    </>
  )
}
