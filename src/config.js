// Clinic facts used across the site. Edit here, not in components.

export const CLINIC = {
  name: 'Klinik Utama Baruga Medical Center',
  shortName: 'Baruga Medical Center',
  phoneDisplay: '0851-2101-9161',
  phone: '+6285121019161',
  whatsapp: '6285121019161', // international format without "+"
  email: 'admin@barugamedicalcenter.com',
  addressLines: ['Jl. Raya Baruga No.28, Antang, Kec. Manggala', 'Kota Makassar, Sulawesi Selatan 90234'],
  mapsUrl: 'https://maps.app.goo.gl/yTKFD9eF7oSNfg1E9',
  instagram: 'https://www.instagram.com/barugamedicalcenter/',
  facebook: '', // leave empty to hide
  tiktok: '',
}

// Dental and general practice share the same hours for now.
export const HOURS = [
  { days: { id: 'Senin – Sabtu', en: 'Mon – Sat' }, time: '17:00 – 22:00 WITA' },
  { days: { id: 'Minggu & libur nasional', en: 'Sun & public holidays' }, time: { id: 'Tutup', en: 'Closed' } },
]

// Current promotion shown in the hero. It disappears automatically after `end` (inclusive,
// clinic date); set PROMO to null to hide it. Mirrors the campaign at promo.barugamedicalcenter.com.
export const PROMO = {
  start: '2026-10-23',
  end: '2026-11-22',
  service: 'ortho', // booking option the promo button preselects
  tag: { id: 'Promo Terbatas', en: 'Limited Offer' },
  value: { id: 'Diskon 20%', en: '20% Off' },
  title: { id: 'Perawatan Behel (Ortodonti)', en: 'Orthodontic Treatment (Braces)' },
  perk: { id: 'Plus konsultasi awal GRATIS untuk ortodonti & prostodonti.', en: 'Plus a FREE first consultation for orthodontics & prosthodontics.' },
  terms: { id: 'Syarat & ketentuan berlaku. Kuota terbatas.', en: 'Terms apply. Limited slots.' },
  detailsUrl: 'https://promo.barugamedicalcenter.com/',
}

export function activePromo(now = new Date()) {
  if (!PROMO) return null
  const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Makassar' })
  return today >= PROMO.start && today <= PROMO.end ? PROMO : null
}

export const waLink = (message = '') =>
  `https://wa.me/${CLINIC.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`

// Doctors grouped by department, in display order. Photos live in /public/img/doctors;
// a missing photo falls back to initials. `service` links a group to a booking option.
export const DOCTOR_GROUPS = [
  {
    service: 'ortho',
    title: { id: 'Spesialis Ortodonti', en: 'Orthodontics' },
    doctors: [
      { name: 'drg. Gerwyn Dewanta P., Sp.Orto', photo: '/img/doctors/gerwyn.jpg' },
      { name: 'drg. Muh. Arizal Fuad Alam, Sp.Ort', photo: '/img/doctors/arizal.jpg' },
    ],
    role: { id: 'Dokter Gigi Spesialis Ortodonti', en: 'Orthodontist' },
  },
  {
    service: 'prosto',
    title: { id: 'Spesialis Prostodonti', en: 'Prosthodontics' },
    doctors: [
      { name: 'drg. Ian Afifah Sudarman, Sp.Pros', photo: '/img/doctors/ian.jpg' },
      { name: 'drg. Andi Adhiyat Takdir, Sp.Pros', photo: '/img/doctors/adhiyat.jpg' },
      { name: 'drg. Rezki Wahyuni Syamsuddin, Sp.Pros', photo: '/img/doctors/rezki.jpg' },
    ],
    role: { id: 'Dokter Gigi Spesialis Prostodonti', en: 'Prosthodontist' },
  },
  {
    service: 'surgery',
    title: { id: 'Spesialis Bedah Mulut & Maksilofasial', en: 'Oral & Maxillofacial Surgery' },
    doctors: [{ name: 'drg. Husnul Basyar, Sp.BMM', photo: '/img/doctors/husnul.jpg' }],
    role: { id: 'Dokter Gigi Spesialis Bedah Mulut & Maksilofasial', en: 'Oral & Maxillofacial Surgeon' },
  },
  {
    service: 'perio',
    title: { id: 'Spesialis Periodonti', en: 'Periodontics' },
    doctors: [{ name: 'drg. Nur Masyta Suriadi, Sp.Perio', photo: '/img/doctors/masyta.jpg' }],
    role: { id: 'Dokter Gigi Spesialis Periodonti', en: 'Periodontist' },
  },
  {
    service: 'dentist',
    title: { id: 'Dokter Gigi', en: 'General Dentistry' },
    doctors: [{ name: 'drg. Andi Arigoh Asjad', photo: '/img/doctors/arigoh.jpg' }],
    role: { id: 'Dokter Gigi', en: 'Dentist' },
  },
  {
    service: 'gp',
    title: { id: 'Dokter Umum', en: 'General Practice' },
    doctors: [{ name: 'dr. Andi Gunara', photo: '/img/doctors/gunara.jpg' }],
    role: { id: 'Dokter Umum · Vaksin Umroh & Haji', en: 'General Practitioner · Umrah & Hajj Vaccines' },
  },
]

// Booking options. `group` points at DOCTOR_GROUPS to offer a doctor choice.
export const SERVICES = [
  { key: 'prosto', group: 'prosto', title: { id: 'Prostodonti & Implan', en: 'Prosthodontics & Implants' }, hint: { id: 'Gigi tiruan, crown, implan', en: 'Dentures, crowns, implants' } },
  { key: 'ortho', group: 'ortho', title: { id: 'Ortodonti (Behel)', en: 'Orthodontics (Braces)' }, hint: { id: 'Behel, clear aligner', en: 'Braces, clear aligners' } },
  { key: 'dentist', group: 'dentist', title: { id: 'Perawatan Gigi Umum', en: 'General Dentistry' }, hint: { id: 'Tambal, scaling, cabut gigi', en: 'Fillings, scaling, extractions' } },
  { key: 'specialist', group: null, title: { id: 'Spesialis Lainnya', en: 'Other Specialists' }, hint: { id: 'Bedah mulut, periodonti (gusi)', en: 'Oral surgery, periodontics (gums)' } },
  { key: 'vaccine', group: 'gp', title: { id: 'Vaksin Umroh & Haji', en: 'Umrah & Hajj Vaccine' }, hint: { id: 'Meningitis, polio, ICV', en: 'Meningitis, polio, ICV' } },
  { key: 'gp', group: 'gp', title: { id: 'Dokter Umum', en: 'General Practitioner' }, hint: { id: 'Konsultasi & surat sehat', en: 'Check-ups & certificates' } },
]

// Bookable times, Monday–Saturday (getDay 1–6), 30-minute slots from 17:00 until 21:30.
export const SCHEDULE = { openDays: [1, 2, 3, 4, 5, 6], startHour: 17, endHour: 22, slotMinutes: 30 }
