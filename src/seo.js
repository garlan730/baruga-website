// Search metadata and structured data per page. Used by the build-time prerender
// (scripts/prerender.mjs). Titles live in pageMeta.js so pages can use them too.
import { CLINIC, DOCTOR_GROUPS } from './config.js'
import { FAQ as HOME_FAQ } from './pages/Home.jsx'
import { FAQ as VACCINE_FAQ } from './pages/Vaccine.jsx'
import { PAGES } from './pageMeta.js'

export { PAGES }

export const SITE_URL = 'https://barugamedicalcenter.com'
export const OG_IMAGE = `${SITE_URL}/img/og-image.jpg`

const CLINIC_ID = `${SITE_URL}/#clinic`

function clinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'Dentist'],
    '@id': CLINIC_ID,
    name: CLINIC.name,
    alternateName: [CLINIC.shortName, 'BMC Makassar'],
    url: SITE_URL,
    logo: `${SITE_URL}/img/logo.png`,
    image: OG_IMAGE,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Raya Baruga No.28, Antang, Kec. Manggala',
      addressLocality: 'Makassar',
      addressRegion: 'Sulawesi Selatan',
      postalCode: '90234',
      addressCountry: 'ID',
    },
    hasMap: CLINIC.mapsUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '17:00',
        closes: '22:00',
      },
    ],
    medicalSpecialty: ['Dentistry', 'PrimaryCare'],
    availableService: [
      'Behel (ortodonti)',
      'Clear aligner',
      'Implan gigi',
      'Gigi palsu (prostodonti)',
      'Crown & bridge',
      'Veneer',
      'Cabut gigi bungsu',
      'Perawatan gusi (periodonti)',
      'Tambal & scaling gigi',
      'Vaksin meningitis Umroh & Haji',
      'Vaksin polio Umroh & Haji',
      'Penerbitan ICV',
    ].map((name) => ({ '@type': 'MedicalProcedure', name })),
    employee: DOCTOR_GROUPS.flatMap((g) =>
      g.doctors.map((d) => ({
        '@type': 'Person',
        name: d.name,
        jobTitle: g.role.id,
        ...(d.photo ? { image: `${SITE_URL}${d.photo}` } : {}),
      })),
    ),
    sameAs: [CLINIC.instagram, CLINIC.facebook, CLINIC.tiktok].filter(Boolean),
  }
}

function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q.id,
      acceptedAnswer: { '@type': 'Answer', text: f.a.id },
    })),
  }
}

export function jsonLdFor(path) {
  if (path === '/vaksin-umroh') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        name: PAGES[1].title,
        url: `${SITE_URL}/vaksin-umroh`,
        about: { '@type': 'MedicalTherapy', name: 'Vaksinasi meningitis dan polio untuk Umroh & Haji' },
        provider: { '@id': CLINIC_ID },
        inLanguage: 'id',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Vaksin Umroh & Haji', item: `${SITE_URL}/vaksin-umroh` },
        ],
      },
      faqSchema(VACCINE_FAQ),
      clinicSchema(),
    ]
  }
  return [clinicSchema(), faqSchema(HOME_FAQ)]
}
