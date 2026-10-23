/**
 * Baruga Medical Center – website booking → Google Calendar.
 *
 * Deploy as a web app while signed in as admin@barugamedicalcenter.com, so events land in
 * that account's calendar (see README.md):
 *   POST {service, name, phone, date, time, promo} -> creates a 30-minute calendar event
 *   GET                                             -> { ok: true } (health check)
 *
 * Slots are not exclusive: several doctors work at once, and the clinic confirms each
 * request on WhatsApp. Events are marked "(belum dikonfirmasi)" until staff edit them.
 */

const CALENDAR_ID = 'primary' // or a dedicated calendar's ID, e.g. "Booking Website"
const TZ = 'Asia/Makassar'
const OPEN_DAYS = [1, 2, 3, 4, 5, 6] // Mon–Sat, keep in sync with SCHEDULE in src/config.js
const START_HOUR = 17
const END_HOUR = 22
const SLOT_MINUTES = 30
const TAG_KEY = 'bmcWebsiteBooking'

// Calendar colors per service key (see SERVICES in src/config.js).
const COLORS = {
  prosto: CalendarApp.EventColor.PALE_BLUE,
  ortho: CalendarApp.EventColor.MAUVE,
  dentist: CalendarApp.EventColor.PALE_GREEN,
  specialist: CalendarApp.EventColor.YELLOW,
  vaccine: CalendarApp.EventColor.ORANGE,
  gp: CalendarApp.EventColor.GRAY,
}

function doGet() {
  return json_({ ok: true })
}

function doPost(e) {
  let body
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    return json_({ ok: false, error: 'invalid' })
  }

  const service = String(body.service || '').trim().slice(0, 20)
  const serviceLabel = String(body.serviceLabel || service).trim().slice(0, 60)
  const name = String(body.name || '').trim().slice(0, 80)
  const phone = String(body.phone || '').trim().slice(0, 20)
  const promo = String(body.promo || '').trim().slice(0, 100)
  const date = String(body.date || '')
  const time = String(body.time || '')

  if (!name || !/^[0-9+\s-]{8,16}$/.test(phone)) return json_({ ok: false, error: 'invalid' })
  if (!isValidSlot_(date, time)) return json_({ ok: false, error: 'invalid_slot' })

  const start = toDate_(date, time)
  if (start.getTime() <= Date.now()) return json_({ ok: false, error: 'invalid_slot' })
  const end = new Date(start.getTime() + SLOT_MINUTES * 60 * 1000)

  const event = calendar_().createEvent(serviceLabel + ' – ' + name + ' (belum dikonfirmasi)', start, end, {
    description: [
      'Booking dari website barugamedicalcenter.com',
      'Layanan: ' + serviceLabel,
      'Nama: ' + name,
      'WhatsApp: ' + phone,
      promo ? 'Promo: ' + promo : null,
      '',
      'Balas pasien: https://wa.me/' + toWaNumber_(phone),
      'Setelah dikonfirmasi, hapus "(belum dikonfirmasi)" dari judul.',
    ].filter((l) => l !== null).join('\n'),
    location: 'Klinik Utama Baruga Medical Center, Jl. Raya Baruga No.28, Makassar',
  })
  event.setTag(TAG_KEY, service || '1')
  if (COLORS[service]) event.setColor(COLORS[service])
  return json_({ ok: true })
}

function isValidSlot_(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false
  const weekday = Number(Utilities.formatDate(toDate_(date, '12:00'), TZ, 'u')) % 7 // 1=Mon … 7=Sun -> 0
  if (OPEN_DAYS.indexOf(weekday) === -1) return false
  const [h, m] = time.split(':').map(Number)
  const minutes = h * 60 + m
  return minutes >= START_HOUR * 60 && minutes < END_HOUR * 60 && m % SLOT_MINUTES === 0
}

// "2026-10-24", "18:30" -> Date at that WITA wall-clock time.
function toDate_(date, time) {
  return new Date(date + 'T' + time + ':00+08:00')
}

function toWaNumber_(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? '62' + digits.slice(1) : digits
}

function calendar_() {
  return CALENDAR_ID === 'primary' ? CalendarApp.getDefaultCalendar() : CalendarApp.getCalendarById(CALENDAR_ID)
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
