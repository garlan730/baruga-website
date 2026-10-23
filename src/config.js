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

export const waLink = (message = '') =>
  `https://wa.me/${CLINIC.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`

// Photo filenames live in /public/img/doctors. A missing photo falls back to initials.
export const DOCTORS = [
  { name: 'drg. Andi Gerwyn Dewanta P., Sp.Ort', role: { id: 'Spesialis Ortodonti', en: 'Orthodontist' }, photo: '/img/doctors/gerwyn.jpg' },
  { name: 'drg. Muh. Arizal Fuad Alam, Sp.Ort', role: { id: 'Spesialis Ortodonti', en: 'Orthodontist' }, photo: '/img/doctors/arizal.jpg' },
  { name: 'drg. Ian Afifah Sudarman, Sp.Pros', role: { id: 'Spesialis Prostodonti', en: 'Prosthodontist' }, photo: '/img/doctors/ian.jpg' },
  // TODO: confirm this photo (new-gun.png in the old site) is drg. Adhiyat.
  { name: 'drg. Andi Adhiyat Takdir, Sp.Pros', role: { id: 'Spesialis Prostodonti', en: 'Prosthodontist' }, photo: '/img/doctors/adhiyat.jpg' },
  { name: 'drg. Rezki Wahyuni Syamsuddin, Sp.Pros', role: { id: 'Spesialis Prostodonti', en: 'Prosthodontist' }, photo: '/img/doctors/rezki.jpg' },
  { name: 'drg. Husnul Basyar, Sp.BMM', role: { id: 'Spesialis Bedah Mulut & Maksilofasial', en: 'Oral & Maxillofacial Surgeon' }, photo: '/img/doctors/husnul.jpg' },
  { name: 'drg. Nur Masyta Suriadi, Sp.Perio', role: { id: 'Spesialis Periodonti', en: 'Periodontist' }, photo: '/img/doctors/masyta.jpg' },
]
