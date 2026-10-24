// Search titles and descriptions per route (Indonesian, the indexed language).
export const PAGES = [
  {
    path: '/',
    title: 'Klinik Gigi Spesialis Makassar | Baruga Medical Center',
    description:
      'Dokter gigi spesialis ortodonti (behel), prostodonti (gigi palsu & implan), bedah mulut, dan periodonti di Antang, Makassar. Juga dokter umum & vaksin Umroh. Buka Senin–Sabtu 17.00–22.00.',
  },
  {
    path: '/vaksin-umroh',
    title: 'Vaksin Umroh & Haji Makassar + ICV | Baruga Medical Center',
    description:
      'Vaksin meningitis & polio untuk jamaah Umroh dan Haji di Makassar, lengkap dengan ICV (buku kuning) dalam sekali datang. Melayani perorangan & rombongan travel.',
  },
]

export const pageMeta = (path) => PAGES.find((p) => p.path === path)
