import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { activePromo, CLINIC, HOURS, SCHEDULE, SERVICES, waLink } from '../config.js'
import { useLang } from '../i18n.jsx'
import { Reveal, SectionHead } from './ui.jsx'
import { WhatsAppIcon } from './WhatsAppFloat.jsx'

const pad = (n) => String(n).padStart(2, '0')
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

function allSlots() {
  const out = []
  for (let m = SCHEDULE.startHour * 60; m < SCHEDULE.endHour * 60; m += SCHEDULE.slotMinutes) {
    out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`)
  }
  return out
}

// Slots still bookable on `date`: on today, only those at least 30 minutes away.
function slotsFor(date, now = new Date()) {
  const slots = allSlots()
  if (date !== isoDate(now)) return slots
  const cutoff = now.getHours() * 60 + now.getMinutes() + 30
  return slots.filter((s) => {
    const [h, m] = s.split(':').map(Number)
    return h * 60 + m >= cutoff
  })
}

function upcomingDays(count = 14) {
  const days = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  while (days.length < count) {
    if (SCHEDULE.openDays.includes(d.getDay()) && slotsFor(isoDate(d)).length) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

export default function Booking() {
  const { t, lang } = useLang()
  const [params] = useSearchParams()
  const promo = activePromo()
  const [form, setForm] = useState({ service: '', name: '', phone: '', date: '', time: '' })
  const [usePromo, setUsePromo] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // Links like /?layanan=ortho&promo=1#contact preselect a service (and the promo).
  const fromUrl = params.get('layanan')
  const promoFromUrl = params.get('promo') === '1'
  useEffect(() => {
    if (fromUrl && SERVICES.some((s) => s.key === fromUrl)) setForm((f) => ({ ...f, service: fromUrl }))
    if (promoFromUrl) setUsePromo(true)
  }, [fromUrl, promoFromUrl])

  const days = useMemo(() => upcomingDays(), [])
  const slots = form.date ? slotsFor(form.date) : []
  const locale = lang === 'id' ? 'id-ID' : 'en-GB'
  const dayLabel = (d) => d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  const svc = SERVICES.find((s) => s.key === form.service)
  const showPromo = promo && (form.service === promo.service || usePromo)

  const submit = (e) => {
    e.preventDefault()
    if (!svc) return
    const date = days.find((d) => isoDate(d) === form.date)
    const lines = [
      t({ id: 'Halo Baruga Medical Center, saya mau buat janji:', en: 'Hello Baruga Medical Center, I would like to book an appointment:' }),
      '',
      `${t({ id: 'Nama', en: 'Name' })}: ${form.name.trim()}`,
      `${t({ id: 'No. WhatsApp', en: 'WhatsApp' })}: ${form.phone.trim()}`,
      `${t({ id: 'Layanan', en: 'Service' })}: ${t(svc.title)}`,
      `${t({ id: 'Jadwal', en: 'Time' })}: ${dayLabel(date)}, ${form.time} WITA`,
      showPromo && usePromo ? `${t({ id: 'Promo', en: 'Promo' })}: ${t(promo.value)} ${t(promo.title)}` : null,
    ].filter((l) => l !== null)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener')
  }

  return (
    <section className="booking-section" id="contact">
      <div className="container bk-wrap">
        <div className="bk-intro">
          <SectionHead
            label={{ id: 'Buat Janji', en: 'Book an Appointment' }}
            title={{ id: 'Atur jadwal kunjungan Anda.', en: 'Schedule your visit.' }}
            text={{ id: 'Isi formulir singkat ini, lalu kirim lewat WhatsApp. Tim kami akan membalas untuk konfirmasi jadwal.', en: 'Fill in this short form and send it via WhatsApp. Our team will reply to confirm.' }}
          />
          <div className="bk-contact">
            <div>
              <h5>{t({ id: 'Alamat', en: 'Address' })}</h5>
              <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer">
                {CLINIC.addressLines.map((l) => <span key={l}>{l}<br /></span>)}
              </a>
            </div>
            <div>
              <h5>{t({ id: 'Jam Praktik', en: 'Opening Hours' })}</h5>
              {HOURS.map((h, i) => <p key={i}>{t(h.days)}: {t(h.time)}</p>)}
            </div>
            <div>
              <h5>{t({ id: 'Telepon & WhatsApp', en: 'Phone & WhatsApp' })}</h5>
              <a href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a>
            </div>
            <div>
              <h5>Email</h5>
              <a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a>
            </div>
          </div>
        </div>

        <Reveal as="form" className="bk-card" onSubmit={submit}>
          <fieldset className="bk-field">
            <legend>{t({ id: 'Mau perawatan apa?', en: 'What do you need?' })}</legend>
            <div className="bk-chips">
              {SERVICES.map((s) => (
                <label key={s.key} className={`bk-chip${form.service === s.key ? ' active' : ''}`}>
                  <input type="radio" name="service" value={s.key} checked={form.service === s.key} onChange={set('service')} required />
                  {t(s.title)}
                </label>
              ))}
            </div>
          </fieldset>

          {showPromo && (
            <label className="bk-promo">
              <input type="checkbox" checked={usePromo} onChange={(e) => setUsePromo(e.target.checked)} />
              <span>
                <strong>{t(promo.value)} {t(promo.title)}</strong> — {t({ id: 'gunakan promo ini', en: 'apply this offer' })}
              </span>
            </label>
          )}

          <div className="bk-row">
            <label>
              {t({ id: 'Nama', en: 'Name' })}
              <input required value={form.name} onChange={set('name')} autoComplete="name" />
            </label>
            <label>
              {t({ id: 'No. WhatsApp', en: 'WhatsApp number' })}
              <input required type="tel" inputMode="tel" placeholder="08xx" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </label>
          </div>
          <div className="bk-row">
            <label>
              {t({ id: 'Tanggal', en: 'Date' })}
              <select required value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, time: slotsFor(e.target.value).includes(f.time) ? f.time : '' }))}>
                <option value="">{t({ id: 'Pilih tanggal', en: 'Choose a date' })}</option>
                {days.map((d) => <option key={isoDate(d)} value={isoDate(d)}>{dayLabel(d)}</option>)}
              </select>
            </label>
            <label>
              {t({ id: 'Jam', en: 'Time' })}
              <select required value={form.time} onChange={set('time')} disabled={!form.date}>
                <option value="">{form.date ? t({ id: 'Pilih jam', en: 'Choose a time' }) : t({ id: 'Pilih tanggal dulu', en: 'Choose a date first' })}</option>
                {slots.map((s) => <option key={s} value={s}>{s} WITA</option>)}
              </select>
            </label>
          </div>

          <button type="submit" className="btn btn-primary bk-submit">
            <WhatsAppIcon size={18} /> {t({ id: 'Kirim via WhatsApp', en: 'Send via WhatsApp' })}
          </button>
          <p className="bk-note">{t({ id: 'Belum pasti jadwalnya? Chat saja dulu — kami bantu carikan waktu yang pas.', en: 'Not sure about the time? Just message us — we’ll help find a slot.' })}</p>
        </Reveal>
      </div>
    </section>
  )
}
