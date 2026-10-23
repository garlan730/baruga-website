# Booking → Google Calendar (Apps Script)

`Code.gs` adds every booking from the website's "Buat Janji" form to the Google Calendar of
**admin@barugamedicalcenter.com**. It runs free under that account. The patient still gets the
WhatsApp message as before; the calendar event is the clinic's copy.

## Setup (one time, about 5 minutes)

1. Sign in as **admin@barugamedicalcenter.com**, then open <https://script.google.com> → **New project**.
2. Delete the sample code, paste all of `Code.gs`, and save. Name the project "Baruga Website Booking".
3. Optional: to keep bookings on a separate calendar (e.g. "Booking Website"), create it in Google
   Calendar, copy its **Calendar ID** from **Settings → Integrate calendar**, and put it in `CALENDAR_ID`.
4. **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me (admin@barugamedicalcenter.com)**
   - Who has access: **Anyone**
5. Click **Deploy** → **Authorize access** → choose the admin account → **Advanced** →
   **Go to Baruga Website Booking (unsafe)** → **Allow**. Google shows this for every private script;
   it only creates events in that calendar.
   If your Google Workspace admin settings block "Anyone" access, allow it in the Admin console
   (Apps → Google Workspace → Drive and Docs → Sharing settings), or use a dedicated calendar.
6. Copy the **Web app URL** (ends in `/exec`) and put it in `BOOKING_API_URL` in `src/config.js`.
   Commit and push; the site redeploys automatically.

Check: opening the `/exec` URL in a browser returns `{"ok":true}`.

## If the Workspace account refuses public access ("Akses Ditolak")

Some Google Workspace editions block anonymous web apps even when "Who has access" is Anyone.
Run the script from a personal Gmail account instead, writing into the admin calendar:

1. As **admin@barugamedicalcenter.com**, open Google Calendar → **Settings** → the admin calendar →
   **Share with specific people or groups** → add the Gmail address with **Make changes to events**.
2. As the **Gmail** account, open the invitation email and add the calendar.
3. As the **Gmail** account, create the Apps Script project (steps 1–6 above), but set
   `CALENDAR_ID = 'admin@barugamedicalcenter.com'` before deploying. Run `doGet` once from the editor
   to grant calendar permission, then deploy as a Web app with access **Anyone**.

## Day to day

- New bookings appear as "Layanan – Nama (belum dikonfirmasi)", colored by service, with a
  WhatsApp link to the patient in the description. Remove "(belum dikonfirmasi)" once confirmed.
- To cancel, delete the event.
- After editing `Code.gs`: **Deploy → Manage deployments → Edit → Version: New version → Deploy**
  (keeps the same URL).
- Opening hours live in both `Code.gs` and `SCHEDULE` in `src/config.js`; keep them in sync.
