import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CLINIC, DOCTOR_GROUPS, HOURS, waLink } from '../config.js'
import { useLang } from '../i18n.jsx'
import { Faq, Reveal, SectionHead, usePageTitle } from '../components/ui.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'
import Booking from '../components/Booking.jsx'

const TRUST = [
  { id: 'Dokter Gigi Spesialis Lengkap', en: 'A Full Specialist Team' },
  { id: 'Prostodonti & Implan', en: 'Prosthodontics & Implants' },
  { id: 'Ortodonti & Aligner', en: 'Orthodontics & Aligners' },
  { id: 'Dokter Umum & Vaksin Umroh', en: 'GP & Umrah Vaccines' },
]

const TREATMENTS = [
  {
    id: 'prosthodontics',
    video: '/video/prosthodontics.mp4',
    poster: '/img/cases/prostho-case.jpg',
    title: { id: 'Prostodonti & Implan Gigi', en: 'Prosthodontics & Dental Implants' },
    text: {
      id: 'Gigi hilang, patah, atau aus? Dokter gigi spesialis prostodonti kami mengembalikan fungsi kunyah, kenyamanan, dan estetika senyum Anda dengan rencana perawatan yang disesuaikan untuk jangka panjang.',
      en: 'Missing, broken, or worn teeth? Our prosthodontists restore chewing function, comfort, and the look of your smile with a plan built for the long term.',
    },
    items: [
      { id: 'Implan gigi', en: 'Dental implants' },
      { id: 'Mahkota (crown) & jembatan (bridge)', en: 'Crowns & bridges' },
      { id: 'Veneer & restorasi estetik', en: 'Veneers & aesthetic restorations' },
      { id: 'Gigi tiruan lepasan & cekat', en: 'Removable & fixed dentures' },
      { id: 'Rehabilitasi seluruh mulut', en: 'Full-mouth rehabilitation' },
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
      id: 'Gigi berjejal, renggang, atau maju? Dokter gigi spesialis ortodonti kami merencanakan setiap pergerakan gigi dengan cermat untuk senyum yang rapi, seimbang, dan gigitan yang sehat.',
      en: 'Crowded, gapped, or protruding teeth? Our orthodontists carefully plan every tooth movement for a straight, balanced smile and a healthy bite.',
    },
    items: [
      { id: 'Behel metal', en: 'Metal braces' },
      { id: 'Behel keramik', en: 'Ceramic braces' },
      { id: 'Clear aligner', en: 'Clear aligners' },
      { id: 'Ortodonti anak, remaja & dewasa', en: 'Orthodontics for children, teens & adults' },
      { id: 'Kasus ortodonti kompleks', en: 'Complex orthodontic cases' },
    ],
    cta: { id: 'Buat janji ortodonti', en: 'Book orthodontics' },
    service: 'ortho',
  },
]

const SUPPORT = [
  {
    title: { id: 'Bedah Mulut & Maksilofasial', en: 'Oral & Maxillofacial Surgery' },
    text: { id: 'Pencabutan gigi bungsu (impaksi), bedah minor, dan bedah penunjang implan.', en: 'Wisdom tooth (impaction) removal, minor oral surgery, and surgery supporting implants.' },
  },
  {
    title: { id: 'Periodonti', en: 'Periodontics' },
    text: { id: 'Perawatan gusi berdarah, karang gigi, dan jaringan penyangga gigi.', en: 'Care for bleeding gums, tartar, and the tissues that support your teeth.' },
  },
]

const GP_ITEMS = [
  { id: 'Konsultasi & pemeriksaan dokter umum', en: 'General practitioner consultations' },
  { id: 'Vaksin meningitis & polio untuk Umroh dan Haji', en: 'Meningitis & polio vaccines for Umrah and Hajj' },
  { id: 'Penerbitan ICV (buku kuning)', en: 'ICV (yellow book) issuance' },
  { id: 'Surat keterangan sehat', en: 'Medical certificates' },
]

const WHY = [
  {
    title: { id: 'Spesialis Lengkap, Satu Klinik', en: 'Every Specialist, One Clinic' },
    text: { id: 'Prostodonti, ortodonti, bedah mulut, dan periodonti ada di sini. Kasus yang melibatkan beberapa bidang ditangani bersama, tanpa perlu dirujuk ke tempat lain.', en: 'Prosthodontics, orthodontics, oral surgery, and periodontics under one roof. Cases spanning several fields are handled together — no referrals elsewhere.' },
  },
  {
    title: { id: 'Rencana Perawatan Personal', en: 'Personalized Planning' },
    text: { id: 'Setiap perawatan dimulai dengan mendengarkan keluhan dan tujuan Anda, lalu menjelaskan pilihan dan biayanya secara terbuka.', en: 'Every treatment starts by listening to your concerns and goals, then explaining your options and costs openly.' },
  },
  {
    title: { id: 'Teknologi Modern', en: 'Modern Technology' },
    text: { id: 'Diagnosis dan perencanaan digital membuat hasil perawatan lebih tepat dan terprediksi.', en: 'Digital diagnosis and planning make outcomes more precise and predictable.' },
  },
  {
    title: { id: 'Praktik Sore, Sesuai Jadwal Anda', en: 'Evening Hours That Fit Your Day' },
    text: { id: 'Buka Senin–Sabtu pukul 17.00–22.00 WITA, jadi Anda bisa datang sepulang kerja atau sekolah.', en: 'Open Monday–Saturday, 17:00–22:00 WITA, so you can visit after work or school.' },
  },
]

const JOURNEYS = {
  implant: {
    tab: { id: 'Implan Gigi', en: 'Dental Implants' },
    title: { id: 'Mengganti gigi yang hilang, langkah demi langkah.', en: 'Replacing a missing tooth, step by step.' },
    steps: [
      [{ id: 'Konsultasi', en: 'Consultation' }, { id: 'Pemeriksaan & diskusi awal', en: 'Initial assessment and discussion' }],
      [{ id: 'Asesmen Digital', en: 'Digital Assessment' }, { id: 'Rontgen & analisis tulang', en: 'X-rays and bone analysis' }],
      [{ id: 'Rencana Perawatan', en: 'Treatment Plan' }, { id: 'Pilihan & estimasi biaya', en: 'Options and cost estimate' }],
      [{ id: 'Pemasangan Implan', en: 'Implant Placement' }, { id: 'Prosedur dengan anestesi lokal', en: 'Done under local anesthesia' }],
      [{ id: 'Restorasi', en: 'Restoration' }, { id: 'Pemasangan mahkota atau bridge', en: 'Crown or bridge fitted' }],
      [{ id: 'Kontrol', en: 'Follow-Up' }, { id: 'Pemantauan berkala', en: 'Regular check-ups' }],
    ],
  },
  ortho: {
    tab: { id: 'Ortodonti', en: 'Orthodontics' },
    title: { id: 'Senyum rapi dimulai dari rencana yang matang.', en: 'A straighter smile starts with a thoughtful plan.' },
    steps: [
      [{ id: 'Konsultasi Awal', en: 'Initial Consultation' }, { id: 'Diskusikan keluhan & tujuan', en: 'Discuss your concerns and goals' }],
      [{ id: 'Pemeriksaan', en: 'Records' }, { id: 'Foto, rontgen & cetak/scan gigi', en: 'Photos, X-rays, and impressions/scan' }],
      [{ id: 'Rencana Perawatan', en: 'Treatment Plan' }, { id: 'Pilihan alat & durasi', en: 'Appliance options and duration' }],
      [{ id: 'Perawatan Aktif', en: 'Active Treatment' }, { id: 'Behel atau aligner, kontrol rutin', en: 'Braces or aligners, regular visits' }],
      [{ id: 'Retensi', en: 'Retention' }, { id: 'Retainer untuk menjaga hasil', en: 'Retainers to keep your result' }],
    ],
  },
  vaccine: {
    tab: { id: 'Vaksin Umroh', en: 'Umrah Vaccine' },
    title: { id: 'Persiapan kesehatan ibadah, cukup sekali datang.', en: 'Pilgrimage health prep, in a single visit.' },
    steps: [
      [{ id: 'Buat Janji', en: 'Book' }, { id: 'Pilih jadwal online atau via WhatsApp', en: 'Online or via WhatsApp' }],
      [{ id: 'Pemeriksaan', en: 'Check-up' }, { id: 'Skrining oleh dokter umum', en: 'Screening by our GP' }],
      [{ id: 'Vaksinasi', en: 'Vaccination' }, { id: 'Meningitis & polio', en: 'Meningitis & polio' }],
      [{ id: 'ICV Terbit', en: 'ICV Issued' }, { id: 'Sertifikat langsung dibawa pulang', en: 'Take your certificate home' }],
    ],
  },
}

const RESULTS = [
  {
    img: '/img/cases/prostho-case.jpg',
    title: { id: 'Perawatan Saluran Akar & Mahkota Sementara', en: 'Root Canal Treatment & Provisional Crown' },
    text: { id: 'Gigi yang rusak dirawat saluran akarnya lalu dilindungi mahkota sementara — kembali bebas nyeri, berfungsi, dan tampak alami.', en: 'A damaged tooth treated with a root canal and protected by a provisional crown — pain-free, functional, and natural-looking again.' },
  },
  {
    img: '/img/cases/ortho-case.jpg',
    title: { id: 'Perawatan Ortodonti Dewasa', en: 'Adult Orthodontic Treatment' },
    text: { id: 'Perawatan behel menyeluruh untuk susunan gigi yang rapi dan gigitan yang seimbang.', en: 'Comprehensive braces treatment for well-aligned teeth and a balanced bite.' },
  },
]

const FAQ = [
  {
    q: { id: 'Dokter gigi spesialis apa saja yang ada di Baruga?', en: 'Which dental specialists does Baruga have?' },
    a: { id: 'Kami memiliki dokter gigi spesialis prostodonti, ortodonti, bedah mulut & maksilofasial, serta periodonti. Prostodonti dan ortodonti adalah layanan utama kami.', en: 'We have specialists in prosthodontics, orthodontics, oral & maxillofacial surgery, and periodontics. Prosthodontics and orthodontics are our core services.' },
  },
  {
    q: { id: 'Berapa biaya implan gigi?', en: 'How much does a dental implant cost?' },
    a: { id: 'Biaya bergantung pada kondisi tulang, jumlah implan, prosedur pendukung, dan jenis restorasi akhir. Estimasi yang akurat diberikan setelah konsultasi dan pemeriksaan.', en: 'It depends on bone condition, number of implants, supporting procedures, and the final restoration. You’ll get an accurate estimate after a consultation and examination.' },
  },
  {
    q: { id: 'Apakah pemasangan implan sakit?', en: 'Are dental implants painful?' },
    a: { id: 'Prosedur dilakukan dengan anestesi lokal, sehingga umumnya tidak terasa sakit. Rasa tidak nyaman setelahnya biasanya ringan dan dapat diatasi dengan obat pereda nyeri.', en: 'The procedure is done under local anesthesia, so it’s generally painless. Any discomfort afterwards is usually mild and eased with pain relief.' },
  },
  {
    q: { id: 'Berapa lama perawatan behel?', en: 'How long does orthodontic treatment take?' },
    a: { id: 'Umumnya 12–24 bulan, tergantung tingkat kerumitan kasus dan jenis alat yang digunakan.', en: 'Usually 12–24 months, depending on the complexity of the case and the appliance used.' },
  },
  {
    q: { id: 'Apakah tersedia clear aligner?', en: 'Do you offer clear aligners?' },
    a: { id: 'Ya. Dokter spesialis ortodonti akan menilai apakah aligner cocok untuk kasus Anda saat konsultasi.', en: 'Yes. Our orthodontist will assess whether aligners suit your case during the consultation.' },
  },
  {
    q: { id: 'Bisakah saya vaksin Umroh/Haji sekaligus membuat ICV di sini?', en: 'Can I get my Umrah/Hajj vaccines and ICV here?' },
    a: { id: 'Bisa. Dokter umum kami memberikan vaksin meningitis dan polio sekaligus menerbitkan ICV (buku kuning) dalam satu kunjungan.', en: 'Yes. Our GP gives the meningitis and polio vaccines and issues your ICV (yellow book) in the same visit.' },
  },
]

function Hero() {
  const { t } = useLang()
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
              id: 'Tim dokter gigi spesialis lengkap dengan keahlian utama di prostodonti dan ortodonti — didukung teknologi modern dan pelayanan yang penuh perhatian.',
              en: 'A complete team of dental specialists, led by our prosthodontists and orthodontists — backed by modern technology and attentive care.',
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
        <SectionHead
          label={{ id: 'Layanan Utama', en: 'Core Services' }}
          title={{ id: 'Dua keahlian utama kami, untuk senyum yang ingin Anda miliki.', en: 'Two core specialties, for the smile you want to live with.' }}
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
            <p>{t({ id: 'Perawatan yang menyeluruh, tanpa perlu dirujuk ke klinik lain.', en: 'Complete care, without referrals to another clinic.' })}</p>
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
                id: 'Selain perawatan gigi, dokter umum kami melayani pemeriksaan kesehatan dan vaksinasi — termasuk vaksin wajib jamaah Umroh dan Haji, lengkap dengan penerbitan ICV.',
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
        <SectionHead label={{ id: 'Mengapa Baruga', en: 'Why Baruga' }} title={{ id: 'Keahlian yang bisa dipercaya. Perawatan yang bisa dirasakan.', en: 'Expertise you can trust. Care you can feel.' }} />
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
              id: 'Vaksin meningitis dan polio, pemeriksaan dokter, dan ICV (buku kuning) dalam satu kunjungan. Melayani jamaah perorangan maupun rombongan biro perjalanan.',
              en: 'Meningitis and polio vaccines, a doctor’s check-up, and your ICV (yellow book) in a single visit — for individual pilgrims and travel-agency groups alike.',
            })}
          </p>
        </Reveal>
        <Reveal className="umroh-actions" delay={120}>
          <Link to="/vaksin-umroh" className="btn btn-light">{t({ id: 'Lihat Persiapan', en: 'See How to Prepare' })}</Link>
          <a className="btn btn-outline-light" href={waLink(t({ id: 'Halo, saya ingin menjadwalkan vaksin Umroh/Haji (meningitis & polio).', en: 'Hello, I would like to schedule Umrah/Hajj vaccines (meningitis & polio).' }))} target="_blank" rel="noreferrer">
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
          {t({ id: 'Hasil setiap pasien dapat berbeda, tergantung kondisi klinis dan rencana perawatannya.', en: "Individual results vary depending on each patient's clinical condition and treatment plan." })}
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
          title={{ id: 'Tim dokter gigi spesialis.', en: 'Our team of dental specialists.' }}
          text={{
            id: 'Tujuh dokter gigi spesialis di empat bidang — prostodonti, ortodonti, bedah mulut & maksilofasial, dan periodonti — ditambah dokter umum.',
            en: 'Seven dental specialists across four fields — prosthodontics, orthodontics, oral & maxillofacial surgery, and periodontics — plus a general practitioner.',
          }}
        />
        <div className="doctors-grid">{dental.flatMap((g) => g.doctors.map((d) => ({ g, d }))).map(({ g, d }, i) => card(g, d, i))}</div>

        {gp.flatMap((g) =>
          g.doctors.map((d) => (
            <Reveal key={d.name} className="gp-doctor">
              <DoctorPhoto doctor={d} />
              <div>
                <span className="doctor-group">{t(g.title)}</span>
                <h4>{d.name}</h4>
                <p>
                  {t({
                    id: 'Melayani konsultasi dokter umum, surat keterangan sehat, serta vaksin meningitis dan polio untuk jamaah Umroh & Haji lengkap dengan ICV.',
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
      <Booking />
    </>
  )
}
