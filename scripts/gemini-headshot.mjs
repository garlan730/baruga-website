// Turns a casual photo into a team-style studio headshot with Gemini image editing.
// Usage (key read from an env file, never printed):
//   node --env-file=PATH/TO/.env scripts/gemini-headshot.mjs <input.jpg> <output-prefix> [variants]
// Needs GEMINI_API_KEY in the env file.
import { readFile, writeFile } from 'node:fs/promises'

const [input, outPrefix, variantsArg] = process.argv.slice(2)
const key = process.env.GEMINI_API_KEY
if (!input || !outPrefix) throw new Error('usage: gemini-headshot.mjs <input.jpg> <output-prefix> [variants]')
if (!key) throw new Error('GEMINI_API_KEY is not set (pass --env-file)')

const MODELS = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview']
const PROMPT = `Edit this photo into a professional dentist studio headshot for a clinic team page.
Keep the man's face, facial features, hairstyle, beard, skin tone and smile exactly the same — same identity; do not beautify, slim, or alter his face.
Remove the second person on the right completely.
Dress him in a crisp white doctor's coat with notch lapels over a plain white collared shirt; no tie, no name tag, no logo.
Replace the background with a plain dark olive-charcoal studio backdrop (deep muted green-grey, soft even gradient, slightly lighter behind the head).
Soft even studio lighting from the front. Front-facing, centered, framed from mid-chest up with a little headroom, portrait 2:3.
Photorealistic, sharp focus.`

const image = (await readFile(input)).toString('base64')
const count = Number(variantsArg || 2)

async function generate(model) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: 'image/jpeg', data: image } }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '2:3' } },
    }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`${model}: ${res.status} ${body.error?.message ?? ''}`)
  const part = body.candidates?.[0]?.content?.parts?.find((p) => p.inlineData || p.inline_data)
  if (!part) throw new Error(`${model}: no image returned (${body.candidates?.[0]?.finishReason ?? 'unknown'})`)
  return Buffer.from((part.inlineData ?? part.inline_data).data, 'base64')
}

for (const model of MODELS) {
  try {
    for (let i = 1; i <= count; i++) {
      const buf = await generate(model)
      const file = `${outPrefix}-${i}.png`
      await writeFile(file, buf)
      console.log(`wrote ${file} (${model})`)
    }
    process.exit(0)
  } catch (err) {
    console.error(String(err.message))
  }
}
process.exit(1)
