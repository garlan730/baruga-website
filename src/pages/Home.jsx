import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CLINIC, DOCTORS, HOURS, waLink } from '../config.js'
import { useLang } from '../i18n.jsx'
import { Faq, Reveal, SectionHead, usePageTitle } from '../components/ui.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'

const TRUST = [
  { id: 'Dokter Gigi Spesialis', en: 'Specialist Dentists' },
  { id: 'Implan & Prostodonti', en: 'Implants & Prosthodontics' },
  { id: 'Ortodonti Modern', en: 'Modern Orthodontics' },
  { id: 'Dokter Umum & Vaksin Umroh', en: 'GP & Umrah Vaccines' },
]

const TREATMENTS = [
  {
    id: 'prosthodontics',
    video: '/video/prosthodontics.mp4',
    poster: '/img/cases/prostho-case.jpg',
    title: { id: 'Prostodonti & Restorasi Gigi', en: 'Prosthodontics & Dental Restoration' },
    text: {
      id: 'Kembalikan tampilan, fungsi, dan kenyamanan senyum Anda dengan solusi prostodonti yang dirancang sesuai kondisi mulut, gaya hidup, dan kebutuhan jangka panjang Anda.',
      en: 'Restore the appearance, function, and comfort of your smile with prosthodontic solutions designed around your oral health, lifestyle, and long-term needs.',
    },
    items: [
      { id: 'Implan gigi', en: 'Dental implants' },
      { id: 'Mahkota (crown) & jembatan (bridge)', en: 'Crowns & bridges' },
      { id: 'Veneer & restorasi estetik', en: 'Veneers & aesthetic restorations' },
      { id: 'Gigi tiruan (lepasan & cekat)', en: 'Dentures (removable & fixed)' },
      { id: 'Restorasi di atas implan', en: 'Implant-supported restorations' },
      { id: 'Rehabilitasi seluruh mulut', en: 'Full-mouth rehabilitation' },
    ],
  },
  {
    id: 'orthodontics',
    video: '/video/orthodontics.mp4',
    poster: '/img/cases/ortho-case.jpg',
    title: { id: 'Ortodonti', en: 'Orthodontics' },
    text: {
      id: 'Perawatan ortodonti yang direncanakan dengan cermat untuk senyum yang lebih sehat, seimbang, dan percaya diri.',
      en: 'Thoughtfully planned orthodontic treatment for a healthier, more balanced, and confident smile.',
    },
    items: [
      { id: 'Behel konvensional (metal)', en: 'Traditional braces' },
      { id: 'Behel keramik', en: 'Ceramic braces' },
      { id: 'Clear aligner', en: 'Clear aligners' },
      { id: 'Ortodonti dewasa & remaja', en: 'Adult & teen orthodontics' },
      { id: 'Kasus ortodonti kompleks', en: 'Complex orthodontic cases' },
    ],
  },
]

const GP_ITEMS = [
  { id: 'Konsultasi & pemeriksaan dokter umum', en: 'General practitioner consultations' },
  { id: 'Vaksin meningitis untuk Umroh & Haji', en: 'Meningitis vaccine for Umrah & Hajj' },
  { id: 'Vaksin polio untuk Umroh & Haji', en: 'Polio vaccine for Umrah & Hajj' },
  { id: 'Penerbitan ICV (buku kuning)', en: 'ICV (yellow book) issuance' },
  { id: 'Surat keterangan sehat', en: 'Medical certificates' },
]

const WHY = [
  {
    title: { id: 'Keahlian Spesialis', en: 'Specialist Expertise' },
    text: { id: 'Ditangani dokter gigi spesialis prostodonti, ortodonti, periodonti, dan bedah mulut — dengan presisi dan kepedulian.', en: 'Care from specialists in prosthodontics, orthodontics, periodontics, and oral surgery — delivered with precision.' },
  },
  {
    title: { id: 'Rencana Perawatan Personal', en: 'Personalized Planning' },
    text: { id: 'Setiap perawatan dimulai dengan memahami kebutuhan, tujuan, dan kondisi klinis Anda.', en: "Every treatment begins with understanding the patient's needs, goals, and clinical condition." },
  },
  {
    title: { id: 'Teknologi Modern', en: 'Modern Technology' },
    text: { id: 'Diagnostik dan perencanaan digital membantu perawatan lebih tepat dan terprediksi.', en: 'Digital diagnostics and planning make treatment more precise and predictable.' },
  },
  {
    title: { id: 'Satu Klinik, Kebutuhan Keluarga', en: 'One Clinic for the Family' },
    text: { id: 'Dari perawatan gigi spesialis hingga dokter umum dan vaksin perjalanan ibadah — semuanya di satu tempat.', en: 'From specialist dental care to general practice and pilgrimage vaccines — all under one roof.' },
  },
]

const JOURNEYS = {
  implant: {
    tab: { id: 'Implan Gigi', en: 'Dental Implants' },
    title: { id: 'Mengganti gigi yang hilang lebih dari sekadar senyum.', en: 'Replacing a missing tooth is more than restoring a smile.' },
    steps: [
      [{ id: 'Konsultasi', en: 'Consultation' }, { id: 'Diskusi & pemeriksaan awal', en: 'Initial discussion and assessment' }],
      [{ id: 'Asesmen Digital', en: 'Digital Assessment' }, { id: 'Pencitraan & analisis', en: 'Imaging and analysis' }],
      [{ id: 'Rencana Perawatan', en: 'Treatment Plan' }, { id: 'Pendekatan personal', en: 'Personalized approach' }],
      [{ id: 'Pemasangan Implan', en: 'Implant Placement' }, { id: 'Prosedur bedah yang presisi', en: 'Precise surgical procedure' }],
      [{ id: 'Restorasi', en: 'Restoration' }, { id: 'Mahkota atau bridge alami', en: 'Natural-looking crown or bridge' }],
      [{ id: 'Kontrol', en: 'Follow-Up' }, { id: 'Perawatan berkelanjutan', en: 'Ongoing care and support' }],
    ],
  },
  ortho: {
    tab: { id: 'Ortodonti', en: 'Orthodontics' },
    title: { id: 'Senyum rapi dimulai dari rencana yang matang.', en: 'A straighter smile starts with a thoughtful plan.' },
    steps: [
      [{ id: 'Konsultasi Awal', en: 'Initial Consultation' }, { id: 'Diskusikan tujuan Anda', en: 'Discuss your goals' }],
      [{ id: 'Scan Digital', en: 'Digital Scan' }, { id: 'Pemeriksaan yang nyaman', en: 'Comfortable assessment' }],
      [{ id: 'Rencana Perawatan', en: 'Treatment Plan' }, { id: 'Pendekatan personal', en: 'Personalized approach' }],
      [{ id: 'Perawatan Aktif', en: 'Active Treatment' }, { id: 'Behel atau aligner', en: 'Braces or aligners' }],
      [{ id: 'Retensi', en: 'Retention' }, { id: 'Menjaga hasil perawatan', en: 'Maintain your results' }],
    ],
  },
  vaccine: {
    tab: { id: 'Vaksin Umroh', en: 'Umrah Vaccine' },
    title: { id: 'Persiapan kesehatan ibadah, dalam satu kunjungan.', en: 'Pilgrimage health prep, in a single visit.' },
    steps: [
      [{ id: 'Hubungi Kami', en: 'Contact Us' }, { id: 'Jadwalkan via WhatsApp', en: 'Schedule via WhatsApp' }],
      [{ id: 'Pemeriksaan', en: 'Check-up' }, { id: 'Skrining oleh dokter umum', en: 'Screening by our GP' }],
      [{ id: 'Vaksinasi', en: 'Vaccination' }, { id: 'Meningitis & polio', en: 'Meningitis & polio' }],
      [{ id: 'ICV Terbit', en: 'ICV Issued' }, { id: 'Sertifikat siap dibawa', en: 'Certificate ready to go' }],
    ],
  },
}

const RESULTS = [
  {
    img: '/img/cases/prostho-case.jpg',
    title: { id: 'Mahkota Sementara dengan Perawatan Saluran Akar', en: 'Provisional Crown with Root Canal Treatment' },
    text: { id: 'Perawatan saluran akar dilanjutkan mahkota sementara mengembalikan gigi agar bebas nyeri, berfungsi penuh, dan tampak alami.', en: 'Root canal treatment followed by a provisional crown restores the tooth — pain-free, fully functional, and natural-looking.' },
  },
  {
    img: '/img/cases/ortho-case.jpg',
    title: { id: 'Perawatan Ortodonti Dewasa', en: 'Adult Orthodontic Treatment' },
    text: { id: 'Perawatan ortodonti menyeluruh untuk senyum yang seimbang dan percaya diri.', en: 'Comprehensive orthodontic care for a balanced, confident smile.' },
  },
]

const FAQ = [
  {
    q: { id: 'Berapa biaya implan gigi?', en: 'How much does a dental implant cost?' },
    a: { id: 'Biaya bergantung pada kondisi klinis, jumlah implan, prosedur pendukung, dan jenis restorasi akhir. Kami sarankan konsultasi untuk rencana dan estimasi biaya yang akurat.', en: 'Costs depend on your clinical condition, number of implants, supporting procedures, and final restoration. We recommend a consultation for an accurate plan and estimate.' },
  },
  {
    q: { id: 'Berapa lama perawatan implan gigi?', en: 'How long does implant treatment take?' },
    a: { id: 'Bervariasi tergantung kondisi tulang, penyembuhan, dan kompleksitas kasus. Sebagian selesai dalam beberapa bulan, sebagian lain membutuhkan waktu lebih lama.', en: 'It varies with bone condition, healing, and complexity. Some cases finish within a few months; others take longer.' },
  },
  {
    q: { id: 'Apakah pemasangan implan terasa sakit?', en: 'Are dental implants painful?' },
    a: { id: 'Prosedur dilakukan dengan anestesi lokal. Rasa tidak nyaman setelahnya umumnya ringan dan dapat diatasi dengan obat pereda nyeri.', en: 'The procedure uses local anesthesia. Post-operative discomfort is usually mild and manageable with pain relief.' },
  },
  {
    q: { id: 'Berapa lama perawatan behel?', en: 'How long does orthodontic treatment take?' },
    a: { id: 'Tergantung kompleksitas kasus dan metode. Umumnya 12–24 bulan, sebagian kasus lebih singkat atau lebih lama.', en: 'It depends on complexity and method — typically 12–24 months, sometimes shorter or longer.' },
  },
  {
    q: { id: 'Apakah tersedia clear aligner?', en: 'Do you offer clear aligners?' },
    a: { id: 'Ya, untuk pasien yang sesuai. Konsultasi akan menentukan apakah aligner tepat untuk kasus Anda.', en: 'Yes, for suitable candidates. A consultation will determine whether aligners are right for you.' },
  },
  {
    q: { id: 'Apakah saya bisa vaksin Umroh/Haji di sini sekaligus mendapat ICV?', en: 'Can I get my Umrah/Hajj vaccines and ICV here?' },
    a: { id: 'Bisa. Dokter umum kami melayani vaksin meningitis dan polio sekaligus penerbitan ICV (buku kuning). Lihat halaman Vaksin Umroh & Haji untuk persiapannya.', en: 'Yes. Our GP provides meningitis and polio vaccines along with ICV (yellow book) issuance. See the Umrah & Hajj Vaccine page for preparation details.' },
  },
]

const SERVICES = [
  { id: 'Prostodonti / Implan', en: 'Prosthodontics / Implants' },
  { id: 'Ortodonti / Behel', en: 'Orthodontics / Braces' },
  { id: 'Perawatan gigi umum', en: 'General dentistry' },
  { id: 'Dokter umum', en: 'General practitioner' },
  { id: 'Vaksin Umroh / Haji', en: 'Umrah / Hajj vaccine' },
]

function Hero() {
  const { t } = useLang()
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-label">{t({ id: 'Prostodonti · Ortodonti · Dokter Umum', en: 'Prosthodontics · Orthodontics · General Practice' })}</div>
          <h1 className="hero-title">
            {t({ id: 'Kedokteran gigi modern,', en: 'Advanced dentistry,' })}
            <br />
            <em>{t({ id: 'dirancang untuk Anda.', en: 'designed around you.' })}</em>
          </h1>
          <p className="hero-subtitle">
            {t({
              id: 'Perawatan gigi spesialis yang memadukan keahlian klinis, teknologi modern, dan pengalaman pasien yang penuh perhatian — kini juga dengan layanan dokter umum.',
              en: 'Specialist dental care combining clinical expertise, modern technology, and a thoughtful patient experience — now with general practice services too.',
            })}
          </p>
          <div className="hero-buttons">
            <Link to="/#contact" className="btn btn-primary">{t({ id: 'Buat Janji Konsultasi', en: 'Book a Consultation' })}</Link>
            <Link to="/#treatments" className="btn btn-secondary">{t({ id: 'Lihat Perawatan', en: 'Explore Treatments' })}</Link>
          </div>
          <Link to="/vaksin-umroh" className="hero-notice">
            <span className="hero-notice-tag">{t({ id: 'Tersedia', en: 'Available' })}</span>
            {t({ id: 'Vaksin Meningitis & Polio untuk Umroh/Haji + ICV', en: 'Meningitis & Polio vaccines for Umrah/Hajj + ICV' })}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <aside className="hero-card">
          <span className="section-label">{t({ id: 'Jam Praktik', en: 'Opening Hours' })}</span>
          {HOURS.map((h, i) => (
            <div key={i} className="hours-row">
              <span>{t(h.days)}</span>
              <strong>{t(h.time)}</strong>
            </div>
          ))}
          <p className="hero-card-addr">{CLINIC.addressLines[0]}, Makassar</p>
        </aside>
      </div>
    </section>
  )
}

function Treatments() {
  const { t } = useLang()
  return (
    <section className="treatments-section" id="treatments">
      <div className="container">
        <SectionHead label={{ id: 'Layanan Kami', en: 'Our Services' }} title={{ id: 'Perawatan khusus untuk senyum yang ingin Anda miliki.', en: 'Specialized care for the smile you want to live with.' }} />

        {TREATMENTS.map((tr, i) => (
          <Reveal key={tr.id} className={`treatment-block${i % 2 ? ' reverse' : ''}`} id={tr.id}>
            <video className="treatment-media" autoPlay muted loop playsInline preload="metadata" poster={tr.poster}>
              <source src={tr.video} type="video/mp4" />
            </video>
            <div className="treatment-content">
              <span className="treatment-index">0{i + 1}</span>
              <h3>{t(tr.title)}</h3>
              <p className="body-text">{t(tr.text)}</p>
              <ul className="treatment-list">
                {tr.items.map((it, j) => <li key={j}>{t(it)}</li>)}
              </ul>
              <Link to="/#contact" className="btn-link">{t({ id: 'Konsultasikan sekarang', en: 'Book a consultation' })}</Link>
            </div>
          </Reveal>
        ))}

        <Reveal className="treatment-block" id="general">
          <div className="treatment-media gp-panel">
            <span className="gp-panel-label">{t({ id: 'Dokter Umum', en: 'General Practice' })}</span>
            <p className="gp-panel-title">{t({ id: 'Siap sehat sebelum berangkat ke Tanah Suci.', en: 'Ready and healthy before your pilgrimage.' })}</p>
            <div className="gp-chips">
              <span>Meningitis</span>
              <span>Polio</span>
              <span>ICV</span>
            </div>
          </div>
          <div className="treatment-content">
            <span className="treatment-index">03</span>
            <h3>{t({ id: 'Dokter Umum & Vaksinasi', en: 'General Practice & Vaccination' })}</h3>
            <p className="body-text">
              {t({
                id: 'Selain perawatan gigi, dokter umum kami siap melayani pemeriksaan kesehatan dan vaksinasi — termasuk vaksin wajib jamaah Umroh dan Haji lengkap dengan ICV.',
                en: 'Alongside dental care, our general practitioner provides check-ups and vaccinations — including the required Umrah and Hajj vaccines with ICV issuance.',
              })}
            </p>
            <ul className="treatment-list">
              {GP_ITEMS.map((it, j) => <li key={j}>{t(it)}</li>)}
            </ul>
            <Link to="/vaksin-umroh" className="btn-link">{t({ id: 'Info vaksin Umroh & Haji', en: 'Umrah & Hajj vaccine info' })}</Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Why() {
  const { t } = useLang()
  return (
    <section className="why-section">
      <div className="container">
        <SectionHead label={{ id: 'Mengapa Kami', en: 'Why Us' }} title={{ id: 'Keahlian yang bisa dipercaya. Perawatan yang bisa dirasakan.', en: 'Expertise you can trust. Care you can feel.' }} />
        <div className="why-grid">
          {WHY.map((w, i) => (
            <Reveal key={i} className="why-item" delay={i * 80}>
              <h4>{t(w.title)}</h4>
              <p>{t(w.text)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Journey() {
  const { t } = useLang()
  const [tab, setTab] = useState('implant')
  const j = JOURNEYS[tab]
  return (
    <section className="journey-section">
      <div className="container">
        <SectionHead label={{ id: 'Alur Perawatan', en: 'Your Journey' }} title={j.title} />
        <div className="tabs" role="tablist">
          {Object.entries(JOURNEYS).map(([key, v]) => (
            <button key={key} role="tab" aria-selected={tab === key} className={`tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
              {t(v.tab)}
            </button>
          ))}
        </div>
        <div className="journey-steps" key={tab} style={{ '--cols': j.steps.length }}>
          {j.steps.map(([title, text], i) => (
            <div key={i} className="journey-step">
              <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
              <h5>{t(title)}</h5>
              <p>{t(text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UmrohBand() {
  const { t } = useLang()
  return (
    <section className="umroh-band">
      <div className="container umroh-inner">
        <Reveal>
          <span className="section-label light">{t({ id: 'Vaksin Umroh & Haji', en: 'Umrah & Hajj Vaccines' })}</span>
          <h2 className="headline light">{t({ id: 'Fokus beribadah, urusan vaksin serahkan pada kami.', en: 'Focus on your worship — leave the vaccines to us.' })}</h2>
          <p className="body-text light">
            {t({
              id: 'Vaksin meningitis dan polio, pemeriksaan oleh dokter, dan ICV (buku kuning) dalam satu kunjungan. Melayani jamaah perorangan maupun rombongan biro perjalanan.',
              en: 'Meningitis and polio vaccines, a doctor’s check-up, and your ICV (yellow book) in a single visit. For individual pilgrims and travel-agency groups alike.',
            })}
          </p>
        </Reveal>
        <Reveal className="umroh-actions" delay={120}>
          <Link to="/vaksin-umroh" className="btn btn-light">{t({ id: 'Lihat Persiapan', en: 'See Preparation' })}</Link>
          <a className="btn btn-outline-light" href={waLink(t({ id: 'Halo, saya ingin jadwalkan vaksin Umroh/Haji (meningitis & polio).', en: 'Hello, I would like to schedule Umrah/Hajj vaccines (meningitis & polio).' }))} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={18} /> {t({ id: 'Jadwalkan via WhatsApp', en: 'Schedule on WhatsApp' })}
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function Results() {
  const { t } = useLang()
  return (
    <section className="results-section" id="results">
      <div className="container">
        <SectionHead label={{ id: 'Hasil Perawatan', en: 'Results' }} title={{ id: 'Perawatan nyata. Hasil yang terencana.', en: 'Real treatments. Thoughtful results.' }} />
        <div className="results-grid">
          {RESULTS.map((r, i) => (
            <Reveal key={i} className="result-card" delay={i * 100}>
              <img src={r.img} alt={t(r.title)} loading="lazy" />
              <div className="result-info">
                <h4>{t(r.title)}</h4>
                <p>{t(r.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="result-disclaimer">
          {t({ id: 'Hasil setiap pasien berbeda, tergantung kondisi klinis dan rencana perawatan masing-masing.', en: "Individual results vary depending on each patient's clinical condition and treatment plan." })}
        </p>
      </div>
    </section>
  )
}

function DoctorPhoto({ doctor }) {
  const [failed, setFailed] = useState(false)
  const initials = doctor.name
    .replace(/^drg?\.\s*/i, '')
    .split(',')[0]
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !w.endsWith('.'))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  if (failed || !doctor.photo) return <div className="doctor-image placeholder">{initials}</div>
  return <img className="doctor-image" src={doctor.photo} alt={doctor.name} loading="lazy" onError={() => setFailed(true)} />
}

function Doctors() {
  const { t } = useLang()
  return (
    <section className="doctors-section" id="doctors">
      <div className="container">
        <SectionHead label={{ id: 'Tim Kami', en: 'Our Team' }} title={{ id: 'Profesional berpengalaman. Perhatian personal.', en: 'Experienced professionals. Personal attention.' }} />
        <div className="doctors-grid">
          {DOCTORS.map((d, i) => (
            <Reveal key={d.name} className="doctor-card" delay={(i % 4) * 70}>
              <DoctorPhoto doctor={d} />
              <h4>{d.name}</h4>
              <div className="doctor-specialty">{t(d.role)}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', phone: '', service: '', date: '', message: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const lines = [
      t({ id: 'Halo Baruga Medical Center, saya ingin membuat janji.', en: 'Hello Baruga Medical Center, I would like to book an appointment.' }),
      `${t({ id: 'Nama', en: 'Name' })}: ${form.name}`,
      `${t({ id: 'No. HP', en: 'Phone' })}: ${form.phone}`,
      form.service && `${t({ id: 'Layanan', en: 'Service' })}: ${form.service}`,
      form.date && `${t({ id: 'Tanggal yang diinginkan', en: 'Preferred date' })}: ${form.date}`,
      form.message && `${t({ id: 'Catatan', en: 'Notes' })}: ${form.message}`,
    ].filter(Boolean)
    window.open(waLink(lines.join('\n')), '_blank', 'noopener')
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div>
          <SectionHead label={{ id: 'Kontak', en: 'Contact' }} title={{ id: 'Buat janji konsultasi.', en: 'Book your consultation.' }} />
          <div className="contact-details">
            <div>
              <h5>{t({ id: 'Alamat Klinik', en: 'Clinic Address' })}</h5>
              <a href={CLINIC.mapsUrl} target="_blank" rel="noreferrer">
                {CLINIC.addressLines.map((l) => <span key={l}>{l}<br /></span>)}
              </a>
            </div>
            <div>
              <h5>{t({ id: 'Telepon & WhatsApp', en: 'Phone & WhatsApp' })}</h5>
              <a href={`tel:${CLINIC.phone}`}>{CLINIC.phoneDisplay}</a>
              <br />
              <a href={waLink()} target="_blank" rel="noreferrer">{t({ id: 'Chat via WhatsApp', en: 'Chat on WhatsApp' })}</a>
            </div>
            <div>
              <h5>Email</h5>
              <a href={`mailto:${CLINIC.email}`}>{CLINIC.email}</a>
            </div>
            <div>
              <h5>{t({ id: 'Jam Praktik', en: 'Opening Hours' })}</h5>
              {HOURS.map((h, i) => <p key={i}>{t(h.days)}: {t(h.time)}</p>)}
              <p className="muted">{t({ id: 'Poli Gigi & Dokter Umum', en: 'Dental & General Practice' })}</p>
            </div>
          </div>
        </div>

        <Reveal as="form" className="contact-form" onSubmit={submit}>
          <label>
            {t({ id: 'Nama', en: 'Name' })}
            <input required value={form.name} onChange={set('name')} autoComplete="name" />
          </label>
          <label>
            {t({ id: 'No. HP / WhatsApp', en: 'Phone / WhatsApp' })}
            <input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" />
          </label>
          <div className="form-row">
            <label>
              {t({ id: 'Layanan', en: 'Service' })}
              <select value={form.service} onChange={set('service')}>
                <option value="">{t({ id: 'Pilih…', en: 'Select…' })}</option>
                {SERVICES.map((s) => <option key={s.id} value={t(s)}>{t(s)}</option>)}
              </select>
            </label>
            <label>
              {t({ id: 'Tanggal yang diinginkan', en: 'Preferred date' })}
              <input type="date" value={form.date} onChange={set('date')} />
            </label>
          </div>
          <label>
            {t({ id: 'Catatan', en: 'Message' })}
            <textarea rows={4} value={form.message} onChange={set('message')} />
          </label>
          <button type="submit" className="btn btn-primary">
            <WhatsAppIcon size={18} /> {t({ id: 'Kirim via WhatsApp', en: 'Send via WhatsApp' })}
          </button>
          <p className="form-note">
            {t({ id: 'Formulir akan membuka WhatsApp. Tim kami akan mengonfirmasi jadwal Anda.', en: 'The form opens WhatsApp. Our team will confirm your appointment.' })}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLang()
  usePageTitle({ id: `${CLINIC.name} — Klinik Gigi Spesialis & Vaksin Umroh Makassar`, en: `${CLINIC.name} — Specialist Dental Clinic & Umrah Vaccines, Makassar` })
  return (
    <>
      <Hero />
      <section className="trust-bar">
        <div className="container trust-items">
          {TRUST.map((x, i) => <span key={i} className="trust-item">{t(x)}</span>)}
        </div>
      </section>
      <Treatments />
      <Why />
      <Journey />
      <UmrohBand />
      <Results />
      <Doctors />
      <section className="faq-section" id="faq">
        <div className="container faq-grid">
          <SectionHead label="FAQ" title={{ id: 'Pertanyaan yang sering diajukan.', en: 'Frequently asked questions.' }} />
          <Faq items={FAQ} />
        </div>
      </section>
      <Contact />
    </>
  )
}
