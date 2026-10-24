import { Link } from 'react-router-dom'
import { CLINIC, waLink } from '../config.js'
import { useLang } from '../i18n.jsx'

export default function Footer() {
  const { t } = useLang()
  const socials = [
    ['Instagram', CLINIC.instagram],
    ['Facebook', CLINIC.facebook],
    ['TikTok', CLINIC.tiktok],
  ].filter(([, url]) => url)

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img src="/img/logo-white.png" alt="Baruga Medical Center" className="footer-logo" />
          <p className="footer-tagline">
            {t({ id: 'Klinik gigi spesialis dan dokter umum di Makassar, melayani dengan sepenuh hati.', en: 'Specialist dentistry and general practice in Makassar, with genuine care.' })}
          </p>
        </div>
        <div>
          <h5>{t({ id: 'Layanan', en: 'Services' })}</h5>
          <Link to="/#prosthodontics">{t({ id: 'Prostodonti & Implan', en: 'Prosthodontics & Implants' })}</Link>
          <Link to="/#orthodontics">{t({ id: 'Ortodonti', en: 'Orthodontics' })}</Link>
          <Link to="/#general">{t({ id: 'Dokter Umum', en: 'General Practice' })}</Link>
          <Link to="/vaksin-umroh">{t({ id: 'Vaksin Umroh & Haji', en: 'Umrah & Hajj Vaccine' })}</Link>
        </div>
        <div>
          <h5>{t({ id: 'Kontak', en: 'Contact' })}</h5>
          <a href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a>
          <a href={waLink()} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a>
          <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer">{CLINIC.addressLines[0]}</a>
        </div>
        <div>
          <h5>{t({ id: 'Ikuti Kami', en: 'Follow Us' })}</h5>
          {socials.map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noreferrer">{name}</a>
          ))}
          <a href={CLINIC.reviewUrl} target="_blank" rel="noreferrer" className="footer-review">
            ★ {t({ id: 'Beri ulasan di Google', en: 'Review us on Google' })}
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {CLINIC.name}</span>
        <span>
          {t({
            id: 'Informasi di situs ini hanya untuk edukasi dan tidak menggantikan pemeriksaan langsung oleh dokter.',
            en: 'Information on this site is educational and does not replace an in-person consultation.',
          })}
        </span>
      </div>
    </footer>
  )
}
