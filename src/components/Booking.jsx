import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CLINIC, DOCTOR_GROUPS, HOURS, SCHEDULE, SERVICES, waLink } from '../config.js'
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
    const iso = isoDate(d)
    if (SCHEDULE.openDays.includes(d.getDay()) && slotsFor(iso).length) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

function Step({ n, title, children, done }) {
  return (
    <div className={`bk-step${done ? ' done' : ''}`}>
      <div className="bk-step-head">
        <span className="bk-step-num">{done ? '✓' : n}</span>
        <h4>{title}</h4>
      </div>
      {children}
    </div>
  )
}

export default function Booking() {
  const { t, lang } = useLang()
  const [params] = useSearchParams()
  const [service, setService] = useState('')
  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', notes: '' })

  // Links like /?layanan=ortho#contact preselect a service.
  const fromUrl = params.get('layanan')
  useEffect(() => {
    if (fromUrl && SERVICES.some((s) => s.key === fromUrl)) {
      setService(fromUrl)
      setDoctor('')
    }
  }, [fromUrl])

  const days = useMemo(() => upcomingDays(), [])
  const slots = date ? slotsFor(date) : []
  const svc = SERVICES.find((s) => s.key === service)
  const group = DOCTOR_GROUPS.find((g) => g.service === svc?.group)
  const doctors = group?.doctors ?? []

  const locale = lang === 'id' ? 'id-ID' : 'en-GB'
  const fmtDay = (d) => ({
    dow: d.toLocaleDateString(locale, { weekday: 'short' }),
    day: d.getDate(),
    mon: d.toLocaleDateString(locale, { month: 'short' }),
  })
  const longDate = date
    ? new Date(`${date}T00:00`).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  const pickService = (key) => {
    setService(key)
    setDoctor('')
  }
  const pickDate = (iso) => {
    setDate(iso)
    if (!slotsFor(iso).includes(time)) setTime('')
  }

  const missing = [
    !service && t({ id: 'layanan', en: 'service' }),
    (!date || !time) && t({ id: 'jadwal', en: 'time' }),
    (!form.name.trim() || !form.phone.trim()) && t({ id: 'nama & nomor WhatsApp', en: 'name & WhatsApp number' }),
  ].filter(Boolean)
  const ready = missing.length === 0

  const submit = (e) => {
    e.preventDefault()
    if (!ready) return
    const lines = [
      t({ id: 'Halo Baruga Medical Center, saya mau buat janji:', en: 'Hello Baruga Medical Center, I would like to book an appointment:' }),
      '',
      `${t({ id: 'Layanan', en: 'Service' })}: ${t(svc.title)}`,
      doctor ? `${t({ id: 'Dokter', en: 'Doctor' })}: ${doctor}` : null,
      `${t({ id: 'Jadwal', en: 'Time' })}: ${longDate}, ${time} WITA`,
      `${t({ id: 'Nama', en: 'Name' })}: ${form.name.trim()}`,
      `${t({ id: 'No. WhatsApp', en: 'WhatsApp' })}: ${form.phone.trim()}`,
      form.notes.trim() ? `${t({ id: 'Keluhan/catatan', en: 'Notes' })}: ${form.notes.trim()}` : null,
    ].filter((l) => l !== null)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener')
  }

  return (
    <section className="booking-section" id="contact">
      <div className="container">
        <SectionHead
          center
          label={{ id: 'Buat Janji', en: 'Book an Appointment' }}
          title={{ id: 'Atur jadwal kunjungan Anda.', en: 'Schedule your visit.' }}
          text={{ id: 'Cukup satu menit. Setelah dikirim lewat WhatsApp, tim kami akan membalas untuk konfirmasi jadwal.', en: 'Takes a minute. Your request is sent via WhatsApp and our team will confirm your appointment.' }}
        />

        <Reveal as="form" className="bk-grid" onSubmit={submit}>
          <div className="bk-main">
            <Step n={1} title={t({ id: 'Pilih layanan', en: 'Choose a service' })} done={!!service}>
              <div className="bk-services">
                {SERVICES.map((s) => (
                  <button type="button" key={s.key} className={`bk-service${service === s.key ? ' active' : ''}`} onClick={() => pickService(s.key)} aria-pressed={service === s.key}>
                    <strong>{t(s.title)}</strong>
                    <span>{t(s.hint)}</span>
                  </button>
                ))}
              </div>
              {doctors.length > 1 && (
                <div className="bk-doctors">
                  <span className="bk-sub">{t({ id: 'Dokter (opsional)', en: 'Doctor (optional)' })}</span>
                  <div className="bk-chips">
                    <button type="button" className={`bk-chip${!doctor ? ' active' : ''}`} onClick={() => setDoctor('')}>
                      {t({ id: 'Siapa saja', en: 'Any available' })}
                    </button>
                    {doctors.map((d) => (
                      <button type="button" key={d.name} className={`bk-chip${doctor === d.name ? ' active' : ''}`} onClick={() => setDoctor(d.name)}>
                        {d.name.replace(/,.*$/, '')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Step>

            <Step n={2} title={t({ id: 'Pilih jadwal', en: 'Pick a time' })} done={!!date && !!time}>
              <div className="bk-days" role="listbox" aria-label={t({ id: 'Tanggal', en: 'Date' })}>
                {days.map((d) => {
                  const iso = isoDate(d)
                  const f = fmtDay(d)
                  return (
                    <button type="button" key={iso} role="option" aria-selected={date === iso} className={`bk-day${date === iso ? ' active' : ''}`} onClick={() => pickDate(iso)}>
                      <span>{f.dow}</span>
                      <strong>{f.day}</strong>
                      <span>{f.mon}</span>
                    </button>
                  )
                })}
              </div>
              {date ? (
                <div className="bk-slots">
                  {slots.map((s) => (
                    <button type="button" key={s} className={`bk-chip${time === s ? ' active' : ''}`} onClick={() => setTime(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="bk-hint">{t({ id: 'Pilih tanggal dulu, lalu jamnya.', en: 'Choose a date to see available times.' })}</p>
              )}
            </Step>

            <Step n={3} title={t({ id: 'Data Anda', en: 'Your details' })} done={!!form.name.trim() && !!form.phone.trim()}>
              <div className="bk-fields">
                <label>
                  {t({ id: 'Nama lengkap', en: 'Full name' })}
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                </label>
                <label>
                  {t({ id: 'No. WhatsApp', en: 'WhatsApp number' })}
                  <input required type="tel" inputMode="tel" placeholder="08xx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
                </label>
                <label className="span-2">
                  {t({ id: 'Keluhan atau catatan (opsional)', en: 'Concerns or notes (optional)' })}
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </label>
              </div>
            </Step>
          </div>

          <aside className="bk-side">
            <div className="bk-summary">
              <span className="section-label light">{t({ id: 'Ringkasan', en: 'Summary' })}</span>
              <dl>
                <div>
                  <dt>{t({ id: 'Layanan', en: 'Service' })}</dt>
                  <dd>{svc ? t(svc.title) : '—'}</dd>
                </div>
                {doctors.length > 1 && (
                  <div>
                    <dt>{t({ id: 'Dokter', en: 'Doctor' })}</dt>
                    <dd>{doctor || t({ id: 'Siapa saja', en: 'Any available' })}</dd>
                  </div>
                )}
                <div>
                  <dt>{t({ id: 'Jadwal', en: 'Time' })}</dt>
                  <dd>{date ? `${longDate}${time ? `, ${time} WITA` : ''}` : '—'}</dd>
                </div>
                <div>
                  <dt>{t({ id: 'Nama', en: 'Name' })}</dt>
                  <dd>{form.name.trim() || '—'}</dd>
                </div>
              </dl>
              <button type="submit" className="btn btn-light bk-submit" disabled={!ready}>
                <WhatsAppIcon size={18} /> {t({ id: 'Kirim via WhatsApp', en: 'Send via WhatsApp' })}
              </button>
              <p className="bk-note">
                {ready
                  ? t({ id: 'Tim kami akan membalas di WhatsApp untuk konfirmasi jadwal.', en: 'Our team will confirm your appointment on WhatsApp.' })
                  : `${t({ id: 'Belum diisi', en: 'Still needed' })}: ${missing.join(', ')}.`}
              </p>
            </div>

            <div className="bk-contact">
              <div>
                <h5>{t({ id: 'Alamat', en: 'Address' })}</h5>
                <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer">
                  {CLINIC.addressLines.map((l) => <span key={l}>{l}<br /></span>)}
                </a>
              </div>
              <div>
                <h5>{t({ id: 'Telepon & WhatsApp', en: 'Phone & WhatsApp' })}</h5>
                <a href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a>
              </div>
              <div>
                <h5>{t({ id: 'Jam Praktik', en: 'Opening Hours' })}</h5>
                {HOURS.map((h, i) => <p key={i}>{t(h.days)}: {t(h.time)}</p>)}
              </div>
              <div>
                <h5>Email</h5>
                <a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
