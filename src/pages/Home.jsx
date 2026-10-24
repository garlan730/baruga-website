import { useState } from 'react'
import { Link } from 'react-router-dom'
import { activePromo, CLINIC, DOCTOR_GROUPS, HOURS, TEAM_ORDER, waLink } from '../config.js'
import { useLang } from '../i18n.jsx'
import { Faq, Reveal, SectionHead, usePageTitle } from '../components/ui.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'
import Booking from '../components/Booking.jsx'
import { pageMeta } from '../pageMeta.js'

const TRUST = [
  { id: 'Dokter Gigi Spesialis Lengkap', en: 'A Full Specialist Team' },
  { id: 'Prostodonti & Implan', en: 'Prosthodontics & Implants' },
  { id: 'Behel & Clear Aligner', en: 'Orthodontics & Aligners' },
  { id: 'Dokter Umum & Vaksin Umroh', en: 'GP & Umrah Vaccines' },
]

const TREATMENTS = [
  {
    id: 'prosthodontics',
    video: '/video/prosthodontics.mp4',
    poster: '/img/cases/prostho-case.jpg',
    title: { id: 'Prostodonti & Implan Gigi', en: 'Prosthodontics & Dental Implants' },
    text: {
      id: 'Gigi hilang, patah, atau sudah aus? Dokter gigi spesialis prostodonti kami membantu Anda kembali nyaman mengunyah dan percaya diri tersenyum, dengan perawatan yang direncanakan untuk jangka panjang.',
      en: 'Missing, broken, or worn teeth? Our prosthodontists restore chewing function, comfort, and the look of your smile with a plan built for the long term.',
    },
    items: [
      { id: 'Implan gigi', en: 'Dental implants' },
      { id: 'Mahkota (crown) & jembatan (bridge)', en: 'Crowns & bridges' },
      { id: 'Veneer & perbaikan estetik gigi', en: 'Veneers & aesthetic restorations' },
      { id: 'Gigi tiruan lepasan & cekat', en: 'Removable & fixed dentures' },
      { id: 'Perbaikan gigi menyeluruh (full mouth)', en: 'Full-mouth rehabilitation' },
    ],
    cta: { id: 'Buat janji prostodonti', en: 'Book prosthodontics' },
    service: 'prosto',
  },
  {
    id: 'orthodontics',
    video: '/video/orthodontics.mp4',
    poster: '/img/cases/ortho-case.jpg',
    title: { id: 'Ortodonti', en: 'Orthodontics' },
    text: {
      id: 'Gigi berjejal, renggang, atau tonggos? Dokter gigi spesialis ortodonti kami merapikan susunan gigi Anda secara bertahap dan terencana, supaya senyum lebih rapi dan gigitan tetap sehat.',
      en: 'Crowded, gapped, or protruding teeth? Our orthodontists carefully plan every tooth movement for a straight, balanced smile and a healthy bite.',
    },
    items: [
      { id: 'Behel metal', en: 'Metal braces' },
      { id: 'Behel keramik', en: 'Ceramic braces' },
      { id: 'Clear aligner', en: 'Clear aligners' },
      { id: 'Behel untuk anak, remaja, dan dewasa', en: 'Orthodontics for children, teens & adults' },
      { id: 'Kasus behel yang kompleks', en: 'Complex orthodontic cases' },
    ],
    cta: { id: 'Buat janji ortodonti', en: 'Book orthodontics' },
    service: 'ortho',
  },
]

const SUPPORT = [
  {
    title: { id: 'Bedah Mulut & Maksilofasial', en: 'Oral & Maxillofacial Surgery' },
    text: { id: 'Cabut gigi bungsu yang tumbuh miring (impaksi), bedah minor, dan bedah persiapan implan.', en: 'Wisdom tooth (impaction) removal, minor oral surgery, and surgery supporting implants.' },
  },
  {
    title: { id: 'Periodonti', en: 'Periodontics' },
    text: { id: 'Mengatasi gusi berdarah, karang gigi, dan gigi goyang akibat masalah gusi.', en: 'Treating bleeding gums, tartar, and teeth loosened by gum disease.' },
  },
]

const GP_ITEMS = [
  { id: 'Konsultasi dan pemeriksaan kesehatan umum', en: 'General practitioner consultations' },
  { id: 'Vaksin meningitis & polio untuk Umroh dan Haji', en: 'Meningitis & polio vaccines for Umrah and Hajj' },
  { id: 'Penerbitan ICV (buku kuning)', en: 'ICV (yellow book) issuance' },
  { id: 'Surat keterangan sehat', en: 'Medical certificates' },
]

const WHY = [
  {
    title: { id: 'Semua Spesialis Ada di Sini', en: 'Every Specialist Under One Roof' },
    text: { id: 'Ada dokter gigi spesialis prostodonti, ortodonti, bedah mulut, dan periodonti. Kalau perawatan Anda butuh lebih dari satu bidang, dokter kami langsung berdiskusi — Anda tidak perlu bolak-balik ke klinik lain.', en: 'Prosthodontists, orthodontists, an oral surgeon, and a periodontist in one clinic. If your treatment needs more than one specialty, our doctors work it out together — no running between clinics.' },
  },
  {
    title: { id: 'Dijelaskan Sampai Paham', en: 'Explained Until It’s Clear' },
    text: { id: 'Kami dengarkan dulu keluhan Anda, lalu jelaskan pilihan perawatan beserta biayanya dengan jujur. Keputusan tetap di tangan Anda, tanpa paksaan.', en: 'We listen to your concerns first, then explain your options and costs honestly. The decision is always yours — no pressure.' },
  },
  {
    title: { id: 'Peralatan Modern', en: 'Modern Equipment' },
    text: { id: 'Pemeriksaan dan perencanaan digital membantu dokter bekerja lebih teliti, sehingga hasilnya lebih bisa diperkirakan.', en: 'Digital assessment and planning help our doctors work more precisely, so results are more predictable.' },
  },
  {
    title: { id: 'Buka Sore Hari', en: 'Open in the Evening' },
    text: { id: 'Kami buka Senin–Sabtu pukul 17.00–22.00 WITA, jadi Anda bisa datang sepulang kerja atau sekolah.', en: 'Open Monday–Saturday, 17:00–22:00 WITA, so you can visit after work or school.' },
  },
]

const JOURNEYS = {
  general: {
    tab: { id: 'Perawatan Gigi', en: 'Dental Care' },
    title: { id: 'Dari konsultasi sampai kontrol, kami dampingi.', en: 'From first visit to follow-up, we’re with you.' },
    steps: [
      [{ id: 'Buat Janji', en: 'Book a Visit' }, { id: 'Lewat website atau WhatsApp', en: 'Online or via WhatsApp' }],
      [{ id: 'Pemeriksaan', en: 'Examination' }, { id: 'Cek kondisi gigi & gusi, rontgen bila perlu', en: 'Teeth and gums checked, X-ray if needed' }],
      [{ id: 'Penjelasan & Biaya', en: 'Options & Costs' }, { id: 'Pilihan perawatan dijelaskan, biaya disepakati di awal', en: 'Options explained, costs agreed upfront' }],
      [{ id: 'Perawatan', en: 'Treatment' }, { id: 'Oleh dokter gigi spesialis yang sesuai', en: 'By the right specialist for your case' }],
      [{ id: 'Kontrol', en: 'Follow-Up' }, { id: 'Pemeriksaan ulang agar hasilnya awet', en: 'Check-ups so results last' }],
    ],
  },
  implant: {
    tab: { id: 'Implan & Gigi Tiruan', en: 'Implants & Dentures' },
    title: { id: 'Begini tahapan mengganti gigi yang hilang.', en: 'How we replace missing teeth.' },
    steps: [
      [{ id: 'Konsultasi', en: 'Consultation' }, { id: 'Periksa kondisi gigi & bahas keluhan', en: 'Check your teeth and discuss concerns' }],
      [{ id: 'Rontgen & Analisis', en: 'X-ray & Analysis' }, { id: 'Melihat kondisi tulang rahang', en: 'Checking your jawbone' }],
      [{ id: 'Pilih Solusi', en: 'Choose a Solution' }, { id: 'Implan, bridge, atau gigi tiruan', en: 'Implant, bridge, or dentures' }],
      [{ id: 'Tindakan', en: 'Procedure' }, { id: 'Dilakukan dengan bius lokal bila diperlukan', en: 'Under local anesthesia when needed' }],
      [{ id: 'Gigi Baru Terpasang', en: 'New Teeth Fitted' }, { id: 'Disesuaikan agar nyaman dipakai', en: 'Adjusted for comfort' }],
      [{ id: 'Kontrol', en: 'Follow-Up' }, { id: 'Kontrol rutin agar awet', en: 'Regular check-ups' }],
    ],
  },
  ortho: {
    tab: { id: 'Behel', en: 'Braces' },
    title: { id: 'Senyum rapi dimulai dari rencana yang matang.', en: 'A straighter smile starts with a thoughtful plan.' },
    steps: [
      [{ id: 'Konsultasi Awal', en: 'Initial Consultation' }, { id: 'Ceritakan keluhan & harapan Anda', en: 'Discuss your concerns and goals' }],
      [{ id: 'Pemeriksaan', en: 'Records' }, { id: 'Foto, rontgen & cetak/scan gigi', en: 'Photos, X-rays, and impressions/scan' }],
      [{ id: 'Rencana Perawatan', en: 'Treatment Plan' }, { id: 'Jenis behel & perkiraan lama perawatan', en: 'Appliance options and duration' }],
      [{ id: 'Perawatan Aktif', en: 'Active Treatment' }, { id: 'Pasang behel/aligner, lalu kontrol rutin', en: 'Braces or aligners, regular visits' }],
      [{ id: 'Retensi', en: 'Retention' }, { id: 'Pakai retainer agar gigi tidak bergeser lagi', en: 'Retainers to keep your result' }],
    ],
  },
}

const RESULTS = [
  {
    img: '/img/cases/prostho-case.jpg',
    title: { id: 'Perawatan Saluran Akar & Mahkota Sementara', en: 'Root Canal Treatment & Provisional Crown' },
    text: { id: 'Gigi yang rusak dirawat saluran akarnya, lalu dilindungi mahkota sementara. Kini bebas nyeri, bisa dipakai mengunyah, dan tampak alami.', en: 'A damaged tooth treated with a root canal and protected by a provisional crown — pain-free, functional, and natural-looking again.' },
  },
  {
    img: '/img/cases/ortho-case.jpg',
    title: { id: 'Perawatan Ortodonti Dewasa', en: 'Adult Orthodontic Treatment' },
    text: { id: 'Perawatan behel untuk susunan gigi yang lebih rapi dan gigitan yang seimbang.', en: 'Comprehensive braces treatment for well-aligned teeth and a balanced bite.' },
  },
]

export const FAQ = [
  {
    q: { id: 'Dokter gigi spesialis apa saja yang ada di Baruga?', en: 'Which dental specialists does Baruga have?' },
    a: { id: 'Ada spesialis prostodonti (gigi tiruan & implan), ortodonti (behel), bedah mulut & maksilofasial, dan periodonti (gusi). Prostodonti dan ortodonti adalah layanan utama kami.', en: 'We have specialists in prosthodontics, orthodontics, oral & maxillofacial surgery, and periodontics. Prosthodontics and orthodontics are our core services.' },
  },
  {
    q: { id: 'Berapa biaya implan gigi?', en: 'How much does a dental implant cost?' },
    a: { id: 'Tergantung kondisi tulang rahang, jumlah implan, perawatan pendukung yang dibutuhkan, dan jenis gigi tiruan di atasnya. Perkiraan biaya yang pasti akan dijelaskan setelah dokter memeriksa Anda.', en: 'It depends on bone condition, number of implants, supporting procedures, and the final restoration. You’ll get an accurate estimate after a consultation and examination.' },
  },
  {
    q: { id: 'Apakah pemasangan implan sakit?', en: 'Are dental implants painful?' },
    a: { id: 'Tindakannya dilakukan dengan bius lokal, jadi umumnya tidak terasa sakit. Setelahnya mungkin ada sedikit nyeri, tapi biasanya ringan dan bisa diatasi dengan obat pereda nyeri.', en: 'The procedure is done under local anesthesia, so it’s generally painless. Any discomfort afterwards is usually mild and eased with pain relief.' },
  },
  {
    q: { id: 'Berapa lama perawatan behel?', en: 'How long does orthodontic treatment take?' },
    a: { id: 'Umumnya 1–2 tahun, tergantung kondisi gigi dan jenis behel yang dipakai.', en: 'Usually 12–24 months, depending on the complexity of the case and the appliance used.' },
  },
  {
    q: { id: 'Apakah tersedia clear aligner?', en: 'Do you offer clear aligners?' },
    a: { id: 'Ada. Saat konsultasi, dokter spesialis ortodonti akan memeriksa apakah clear aligner cocok untuk kondisi gigi Anda.', en: 'Yes. Our orthodontist will assess whether aligners suit your case during the consultation.' },
  },
  {
    q: { id: 'Bisa vaksin Umroh/Haji sekaligus buat ICV di sini?', en: 'Can I get my Umrah/Hajj vaccines and ICV here?' },
    a: { id: 'Bisa. Dokter umum kami melayani vaksin meningitis dan polio, dan ICV (buku kuning) langsung diterbitkan di hari yang sama.', en: 'Yes. Our GP gives the meningitis and polio vaccines and issues your ICV (yellow book) in the same visit.' },
  },
]

function PromoCard({ promo }) {
  const { t, lang } = useLang()
  const end = new Date(`${promo.end}T23:59:59+08:00`)
  const daysLeft = Math.max(0, Math.ceil((end - new Date()) / 86400000))
  const endLabel = end.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Makassar' })
  return (
    <aside className="promo-card">
      <span className="promo-tag">{t(promo.tag)}</span>
      <p className="promo-value">{t(promo.value)}</p>
      <p className="promo-title">{t(promo.title)}</p>
      <p className="promo-perk">{t(promo.perk)}</p>
      <p className="promo-deadline">
        {t({ id: `Berlaku sampai ${endLabel}`, en: `Valid until ${endLabel}` })}
        {daysLeft <= 14 && <strong> · {t({ id: `tinggal ${daysLeft} hari`, en: `${daysLeft} days left` })}</strong>}
      </p>
      <Link to={`/?layanan=${promo.service}&promo=1#contact`} className="btn btn-light promo-cta">
        {t({ id: 'Ambil Promo', en: 'Claim Offer' })}
      </Link>
      <p className="promo-terms">
        {t(promo.terms)}{' '}
        {promo.detailsUrl && <a href={promo.detailsUrl} target="_blank" rel="noreferrer">{t({ id: 'Lihat detail', en: 'See details' })}</a>}
      </p>
    </aside>
  )
}

function Hero() {
  const { t } = useLang()
  const promo = activePromo()
  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-label">{t({ id: 'Klinik Gigi Spesialis · Makassar', en: 'Specialist Dental Clinic · Makassar' })}</div>
          <h1 className="hero-title">
            {t({ id: 'Senyum sehat,', en: 'Healthy smiles,' })}
            <br />
            <em>{t({ id: 'ditangani spesialisnya.', en: 'in specialist hands.' })}</em>
          </h1>
          <p className="hero-subtitle">
            {t({
              id: 'Klinik gigi di Makassar dengan dokter gigi spesialis lengkap — terutama prostodonti untuk gigi tiruan & implan, dan ortodonti untuk behel. Ditangani dengan teliti, dilayani dengan ramah.',
              en: 'A Makassar dental clinic with a full team of specialists — led by prosthodontics for dentures & implants, and orthodontics for braces. Careful treatment, friendly service.',
            })}
          </p>
          <div className="hero-buttons">
            <Link to="/#contact" className="btn btn-primary">{t({ id: 'Buat Janji Konsultasi', en: 'Book a Consultation' })}</Link>
            <Link to="/#treatments" className="btn btn-secondary">{t({ id: 'Lihat Layanan', en: 'Explore Services' })}</Link>
          </div>
          <Link to="/vaksin-umroh" className="hero-notice">
            <span className="hero-notice-tag">{t({ id: 'Tersedia', en: 'Available' })}</span>
            {t({ id: 'Vaksin Meningitis & Polio untuk Umroh/Haji + ICV', en: 'Meningitis & Polio vaccines for Umrah/Hajj + ICV' })}
            <span aria-hidden="true">→</span>
          </Link>
          {promo && (
            <p className="hero-hours">
              {t({ id: 'Buka', en: 'Open' })} {t(HOURS[0].days)}, {HOURS[0].time} · {CLINIC.addressLines[0]}
            </p>
          )}
        </div>
        {promo ? <PromoCard promo={promo} /> : (
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
        )}
      </div>
    </section>
  )
}

function Treatments() {
  const { t } = useLang()
  return (
    <section className="treatments-section" id="treatments">
      <div className="container">
        <SectionHead
          label={{ id: 'Layanan Utama', en: 'Core Services' }}
          title={{ id: 'Dua layanan andalan kami.', en: 'Our two signature specialties.' }}
        />

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
              <Link to={`/?layanan=${tr.service}#contact`} className="btn-link">{t(tr.cta)}</Link>
            </div>
          </Reveal>
        ))}

        <Reveal className="support-strip">
          <div className="support-intro">
            <span className="section-label">{t({ id: 'Didukung Spesialis Lainnya', en: 'Supported by More Specialists' })}</span>
            <p>{t({ id: 'Butuh penanganan spesialis lain? Semuanya ada di sini, tanpa perlu dirujuk ke tempat lain.', en: 'Need another specialist? They’re all here — no referral elsewhere.' })}</p>
          </div>
          {SUPPORT.map((s, i) => (
            <div key={i} className="support-item">
              <h4>{t(s.title)}</h4>
              <p>{t(s.text)}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="treatment-block" id="general">
          <div className="treatment-media gp-panel">
            <span className="gp-panel-label">{t({ id: 'Dokter Umum', en: 'General Practice' })}</span>
            <p className="gp-panel-title">{t({ id: 'Sehat dan siap sebelum berangkat ke Tanah Suci.', en: 'Healthy and ready before your pilgrimage.' })}</p>
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
                id: 'Selain perawatan gigi, kami juga punya layanan dokter umum untuk pemeriksaan kesehatan dan vaksinasi — termasuk vaksin wajib jamaah Umroh dan Haji, sekaligus pembuatan ICV.',
                en: 'Alongside dental care, our general practitioner offers check-ups and vaccinations — including the required Umrah and Hajj vaccines, with ICV issuance.',
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
        <SectionHead label={{ id: 'Keunggulan Kami', en: 'Why Baruga' }} title={{ id: 'Kenapa pasien memilih Baruga?', en: 'Why patients choose Baruga' }} />
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
  const [tab, setTab] = useState('general')
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
          <h2 className="headline light">{t({ id: 'Fokus ibadah, urusan vaksin biar kami yang bantu.', en: 'Focus on your worship — leave the vaccines to us.' })}</h2>
          <p className="body-text light">
            {t({
              id: 'Vaksin meningitis dan polio, cek kesehatan oleh dokter, sampai ICV (buku kuning) — beres dalam sekali datang. Kami melayani jamaah perorangan maupun rombongan travel.',
              en: 'Meningitis and polio vaccines, a doctor’s check-up, and your ICV (yellow book) in a single visit — for individual pilgrims and travel-agency groups alike.',
            })}
          </p>
        </Reveal>
        <Reveal className="umroh-actions" delay={120}>
          <Link to="/vaksin-umroh" className="btn btn-light">{t({ id: 'Lihat Info Lengkap', en: 'See Full Details' })}</Link>
          <a className="btn btn-outline-light" href={waLink(t({ id: 'Halo, saya mau jadwalkan vaksin Umroh/Haji (meningitis & polio).', en: 'Hello, I would like to schedule Umrah/Hajj vaccines (meningitis & polio).' }))} target="_blank" rel="noreferrer">
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
        <SectionHead label={{ id: 'Hasil Perawatan', en: 'Results' }} title={{ id: 'Hasil perawatan pasien kami.', en: 'Results from our patients.' }} />
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
          {t({ id: 'Hasil perawatan bisa berbeda pada setiap pasien, tergantung kondisi masing-masing.', en: "Individual results vary depending on each patient's clinical condition and treatment plan." })}
        </p>
      </div>
    </section>
  )
}

function initialsOf(name) {
  return name
    .replace(/^drg?\.\s*/i, '')
    .split(',')[0]
    .split(/\s+/)
    .filter((w) => /^[A-Z]/.test(w) && !w.endsWith('.'))
    .slice(-2)
    .map((w) => w[0])
    .join('')
}

function DoctorPhoto({ doctor }) {
  const [failed, setFailed] = useState(false)
  if (failed || !doctor.photo) return <div className="doctor-image placeholder">{initialsOf(doctor.name)}</div>
  return <img className="doctor-image" src={doctor.photo} alt={doctor.name} loading="lazy" onError={() => setFailed(true)} />
}

function Doctors() {
  const { t } = useLang()
  const dental = DOCTOR_GROUPS.filter((g) => g.service !== 'gp')
  const rank = (name) => (TEAM_ORDER.includes(name) ? TEAM_ORDER.indexOf(name) : TEAM_ORDER.length)
  const team = dental.flatMap((g) => g.doctors.map((d) => ({ g, d }))).sort((a, b) => rank(a.d.name) - rank(b.d.name))
  const gp = DOCTOR_GROUPS.filter((g) => g.service === 'gp')
  const card = (g, d, i) => (
    <Reveal key={d.name} className="doctor-card" delay={(i % 4) * 70}>
      <DoctorPhoto doctor={d} />
      <span className="doctor-group">{t(g.title)}</span>
      <h4>{d.name}</h4>
    </Reveal>
  )

  return (
    <section className="doctors-section" id="doctors">
      <div className="container">
        <SectionHead
          label={{ id: 'Tim Dokter', en: 'Our Doctors' }}
          title={{ id: 'Kenali dokter kami.', en: 'Meet our doctors.' }}
          text={{
            id: 'Tujuh dokter gigi spesialis dari empat bidang — prostodonti, ortodonti, bedah mulut & maksilofasial, dan periodonti — didukung dokter gigi dan dokter umum.',
            en: 'Seven dental specialists across four fields — prosthodontics, orthodontics, oral & maxillofacial surgery, and periodontics — supported by a general dentist and a general practitioner.',
          }}
        />
        <div className="doctors-grid">{team.map(({ g, d }, i) => card(g, d, i))}</div>

        {gp.flatMap((g) =>
          g.doctors.map((d) => (
            <Reveal key={d.name} className="gp-doctor">
              <DoctorPhoto doctor={d} />
              <div>
                <span className="doctor-group">{t(g.title)}</span>
                <h4>{d.name}</h4>
                <p>
                  {t({
                    id: 'Melayani konsultasi kesehatan umum, surat keterangan sehat, serta vaksin meningitis dan polio untuk jamaah Umroh & Haji, lengkap dengan ICV.',
                    en: 'Provides general consultations, medical certificates, and meningitis and polio vaccines for Umrah & Hajj pilgrims, with ICV issuance.',
                  })}
                </p>
                <Link to="/vaksin-umroh" className="btn-link">{t({ id: 'Info vaksin Umroh & Haji', en: 'Umrah & Hajj vaccine info' })}</Link>
              </div>
            </Reveal>
          )),
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLang()
  usePageTitle({ id: pageMeta('/').title, en: 'Specialist Dental Clinic in Makassar | Baruga Medical Center' })
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
      <Results />
      <UmrohBand />
      <Doctors />
      <section className="faq-section" id="faq">
        <div className="container faq-grid">
          <SectionHead label="FAQ" title={{ id: 'Yang sering ditanyakan.', en: 'Common questions.' }} />
          <Faq items={FAQ} />
        </div>
      </section>
      <Booking />
    </>
  )
}
