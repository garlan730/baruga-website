import { Link } from 'react-router-dom'
import { CLINIC, DOCTOR_GROUPS, HOURS, waLink } from '../config.js'
import { useLang } from '../i18n.jsx'
import { Faq, Reveal, SectionHead, usePageTitle } from '../components/ui.jsx'
import { WhatsAppIcon } from '../components/WhatsAppFloat.jsx'

const INCLUDED = [
  {
    tag: '01',
    title: { id: 'Vaksin Meningitis', en: 'Meningitis Vaccine' },
    text: {
      id: 'Vaksin meningokokus (ACWY) yang wajib bagi jamaah Umroh dan Haji sesuai ketentuan Pemerintah Arab Saudi, untuk mencegah meningitis.',
      en: 'The meningococcal (ACWY) vaccine required by Saudi Arabia for Umrah and Hajj pilgrims, protecting against meningitis.',
    },
  },
  {
    tag: '02',
    title: { id: 'Vaksin Polio', en: 'Polio Vaccine' },
    text: {
      id: 'Vaksin polio kini juga menjadi syarat kesehatan bagi jamaah asal Indonesia sebelum berangkat.',
      en: 'The polio vaccine now part of the health requirements for pilgrims travelling from Indonesia.',
    },
  },
  {
    tag: '03',
    title: { id: 'Penerbitan ICV', en: 'ICV Issuance' },
    text: {
      id: 'Buku kuning (International Certificate of Vaccination) langsung diterbitkan di klinik, siap dipakai untuk urusan visa dan perjalanan.',
      en: 'Your International Certificate of Vaccination (yellow book) is issued at the clinic, ready for visa and travel.',
    },
  },
  {
    tag: '04',
    title: { id: 'Pemeriksaan Dokter', en: 'Doctor’s Check-up' },
    text: {
      id: 'Dokter umum memeriksa kondisi Anda dulu sebelum vaksin, termasuk memberi saran untuk jamaah lansia atau yang punya penyakit penyerta.',
      en: 'A short screening by our GP before vaccination, including advice for elderly pilgrims or those with existing conditions.',
    },
  },
]

const STEPS = [
  [{ id: 'Buat janji', en: 'Book a time' }, { id: 'Pilih jadwal lewat website atau WhatsApp. Untuk rombongan, kami siapkan jadwal khusus.', en: 'Pick a time online or message us on WhatsApp. Groups can be scheduled together.' }],
  [{ id: 'Datang ke klinik', en: 'Visit the clinic' }, { id: 'Bawa dokumen yang diperlukan sesuai daftar.', en: 'Bring the documents listed below.' }],
  [{ id: 'Pemeriksaan & vaksinasi', en: 'Check-up & vaccination' }, { id: 'Dokter memeriksa kondisi Anda, lalu memberikan vaksin meningitis dan polio.', en: 'The doctor checks you, then gives the meningitis and polio vaccines.' }],
  [{ id: 'Terima ICV', en: 'Receive your ICV' }, { id: 'ICV jadi hari itu juga dan langsung bisa dibawa pulang.', en: 'Take your international vaccination certificate home the same day.' }],
]

const BRING = [
  { id: 'KTP (asli)', en: 'National ID card (KTP)' },
  { id: 'Paspor atau fotokopinya (nama di ICV disamakan dengan paspor)', en: 'Passport or a copy — the ICV name follows your passport' },
  { id: 'ICV lama, kalau sebelumnya pernah vaksin', en: 'Your previous ICV, if you have one' },
  { id: 'Obat yang sedang rutin diminum (jika ada)', en: 'A list of current medications (if any)' },
]

const TIMING = [
  {
    value: { id: '≥ 10 hari', en: '≥ 10 days' },
    label: { id: 'Vaksin meningitis paling lambat 10 hari sebelum berangkat', en: 'Meningitis vaccine at least 10 days before departure' },
  },
  {
    value: { id: '± 4 minggu', en: '~4 weeks' },
    label: { id: 'Waktu terbaik vaksin polio sebelum berangkat', en: 'Ideal lead time for the polio vaccine before departure' },
  },
  {
    value: { id: '1 kunjungan', en: '1 visit' },
    label: { id: 'Dua vaksin dan ICV selesai dalam sekali datang', en: 'Both vaccines & your ICV can be done in a single visit' },
  },
]

const FAQ = [
  {
    q: { id: 'Kapan sebaiknya saya vaksin?', en: 'When should I get vaccinated?' },
    a: { id: 'Idealnya 2–4 minggu sebelum berangkat. Untuk vaksin meningitis, paling lambat 10 hari sebelum keberangkatan. Sebaiknya jangan mepet, supaya ICV sudah siap saat mengurus visa.', en: 'Ideally 2–4 weeks before departure, and no later than 10 days before for the meningitis vaccine. Don’t leave it to the last minute so your ICV is ready for visa processing.' },
  },
  {
    q: { id: 'Bisakah vaksin meningitis dan polio diberikan di hari yang sama?', en: 'Can meningitis and polio vaccines be given on the same day?' },
    a: { id: 'Umumnya bisa. Dokter akan memeriksa kondisi Anda dulu dan menyesuaikan jika perlu.', en: 'Generally yes. The doctor will assess you first and adjust if needed.' },
  },
  {
    q: { id: 'Berapa lama masa berlaku vaksin meningitis?', en: 'How long is the meningitis vaccine valid?' },
    a: { id: 'Tergantung jenis vaksin yang diberikan, dan tercatat di ICV Anda. Bawa ICV lama saat datang supaya dokter bisa mengeceknya.', en: 'Validity depends on the vaccine type given, as recorded in your ICV. Bring your previous ICV so the doctor can check it.' },
  },
  {
    q: { id: 'Apakah ada efek samping?', en: 'Are there side effects?' },
    a: { id: 'Biasanya ringan, misalnya nyeri atau kemerahan di bekas suntikan, badan pegal, atau demam ringan 1–2 hari.', en: 'Side effects are usually mild — soreness or redness at the injection site, aches, or a low fever for 1–2 days.' },
  },
  {
    q: { id: 'Sedang hamil atau punya penyakit kronis, boleh vaksin?', en: 'I am pregnant / have a chronic condition. Can I be vaccinated?' },
    a: { id: 'Ceritakan kondisi Anda ke dokter saat pemeriksaan. Dokter akan menilai apakah vaksin aman untuk Anda dan memberi saran yang tepat.', en: 'Tell the doctor about your condition at the check-up. They will assess whether vaccination is safe and advise accordingly.' },
  },
  {
    q: { id: 'Bisa untuk rombongan travel atau KBIH?', en: 'Do you serve travel-agency groups?' },
    a: { id: 'Bisa. Hubungi kami lewat WhatsApp untuk mengatur jadwal rombongan, supaya prosesnya cepat dan tertib.', en: 'Yes. Message us on WhatsApp to schedule a group session for a quicker, organized visit.' },
  },
  {
    q: { id: 'Berapa biayanya?', en: 'How much does it cost?' },
    a: { id: 'Hubungi kami lewat WhatsApp untuk info biaya terbaru, termasuk harga rombongan.', en: 'Please message us on WhatsApp for current pricing, including group rates.' },
  },
]

export default function Vaccine() {
  const { t } = useLang()
  usePageTitle({ id: `Vaksin Umroh & Haji (Meningitis & Polio) + ICV — ${CLINIC.shortName}`, en: `Umrah & Hajj Vaccines (Meningitis & Polio) + ICV — ${CLINIC.shortName}` })

  const gp = DOCTOR_GROUPS.find((g) => g.service === 'gp')?.doctors[0]

  const waMessage = t({
    id: 'Halo Baruga Medical Center, saya mau jadwalkan vaksin Umroh/Haji (meningitis & polio) + ICV.\nNama:\nJumlah orang:\nRencana tanggal keberangkatan:',
    en: 'Hello Baruga Medical Center, I would like to schedule Umrah/Hajj vaccines (meningitis & polio) + ICV.\nName:\nNumber of people:\nPlanned departure date:',
  })

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <nav className="breadcrumb">
              <Link to="/">{t({ id: 'Beranda', en: 'Home' })}</Link> <span>/</span> {t({ id: 'Dokter Umum', en: 'General Practice' })}
            </nav>
            <span className="section-label">{t({ id: 'Vaksin Umroh & Haji', en: 'Umrah & Hajj Vaccines' })}</span>
            <h1 className="hero-title">
              {t({ id: 'Berangkat ke Tanah Suci', en: 'Travel to the Holy Land' })}
              <br />
              <em>{t({ id: 'dengan tenang.', en: 'with peace of mind.' })}</em>
            </h1>
            <p className="hero-subtitle">
              {t({
                id: 'Vaksin meningitis dan polio, cek kesehatan oleh dokter, sampai pembuatan ICV (buku kuning) — semuanya beres dalam sekali datang ke Baruga Medical Center.',
                en: 'Meningitis and polio vaccines, a doctor’s check-up, and ICV (yellow book) issuance — all in one visit at Baruga Medical Center.',
              })}
            </p>
            <div className="hero-buttons">
              <Link to="/?layanan=vaccine#contact" className="btn btn-primary">{t({ id: 'Buat Janji Vaksin', en: 'Book a Vaccine Visit' })}</Link>
              <a className="btn btn-secondary" href={waLink(waMessage)} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} /> {t({ id: 'Tanya via WhatsApp', en: 'Ask on WhatsApp' })}
              </a>
            </div>
          </div>
          <div className="cert-card" aria-hidden="true">
            <span className="cert-eyebrow">International Certificate of Vaccination</span>
            <span className="cert-title">ICV</span>
            <div className="cert-lines">
              <div><span>Meningococcal ACWY</span><i>✓</i></div>
              <div><span>Poliomyelitis</span><i>✓</i></div>
            </div>
            <span className="cert-foot">{CLINIC.name}</span>
          </div>
        </div>
      </section>

      <section className="timing-bar">
        <div className="container timing-grid">
          {TIMING.map((x, i) => (
            <Reveal key={i} className="timing-item" delay={i * 80}>
              <strong>{t(x.value)}</strong>
              <span>{t(x.label)}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead label={{ id: 'Layanan', en: 'What’s Included' }} title={{ id: 'Semua yang perlu disiapkan sebelum berangkat.', en: 'Everything you need before you fly.' }} />
          <div className="included-grid">
            {INCLUDED.map((x, i) => (
              <Reveal key={x.tag} className="included-card" delay={i * 80}>
                <span className="step-num">{x.tag}</span>
                <h4>{t(x.title)}</h4>
                <p>{t(x.text)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt" id="prepare">
        <div className="container prepare-grid">
          <div>
            <SectionHead label={{ id: 'Alur', en: 'The Process' }} title={{ id: 'Cukup empat langkah.', en: 'Just four steps.' }} />
            <ol className="steps-list">
              {STEPS.map(([title, text], i) => (
                <Reveal as="li" key={i} delay={i * 80}>
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h5>{t(title)}</h5>
                    <p>{t(text)}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          <Reveal className="bring-card" delay={120}>
            {gp && (
              <div className="bring-doctor">
                <img src={gp.photo} alt={gp.name} loading="lazy" />
                <div>
                  <span className="doctor-group">{t({ id: 'Ditangani oleh', en: 'Your doctor' })}</span>
                  <strong>{gp.name}</strong>
                  <span>{t({ id: 'Dokter Umum', en: 'General Practitioner' })}</span>
                </div>
              </div>
            )}
            <h4>{t({ id: 'Yang perlu dibawa', en: 'What to bring' })}</h4>
            <ul className="treatment-list">
              {BRING.map((b, i) => <li key={i}>{t(b)}</li>)}
            </ul>
            <div className="bring-hours">
              <h5>{t({ id: 'Jam layanan', en: 'Service hours' })}</h5>
              {HOURS.map((h, i) => (
                <div key={i} className="hours-row">
                  <span>{t(h.days)}</span>
                  <strong>{t(h.time)}</strong>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container faq-grid">
          <SectionHead label="FAQ" title={{ id: 'Yang sering ditanyakan soal vaksin Umroh & Haji.', en: 'Umrah & Hajj vaccine questions.' }} />
          <Faq items={FAQ} />
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-inner">
          <h2 className="headline light">{t({ id: 'Yuk, siapkan keberangkatan Anda.', en: 'Let’s get you ready to go.' })}</h2>
          <p className="body-text light">
            {t({ id: 'Untuk perorangan maupun rombongan, hubungi kami untuk jadwal dan info biaya.', en: 'Individuals or groups — message us for schedules and pricing.' })}
          </p>
          <div className="cta-buttons">
            <Link to="/?layanan=vaccine#contact" className="btn btn-light">{t({ id: 'Buat Janji Vaksin', en: 'Book a Vaccine Visit' })}</Link>
            <a className="btn btn-outline-light" href={waLink(waMessage)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} /> {t({ id: 'Tanya via WhatsApp', en: 'Ask on WhatsApp' })}
            </a>
          </div>
          <p className="cta-note">
            {t({
              id: 'Persyaratan vaksin bisa berubah sesuai ketentuan Kemenkes RI dan Pemerintah Arab Saudi. Pastikan juga ke biro perjalanan Anda.',
              en: 'Vaccine requirements may change per Indonesian Ministry of Health and Saudi regulations. Please also confirm with your travel agent.',
            })}
          </p>
        </div>
      </section>
    </>
  )
}
