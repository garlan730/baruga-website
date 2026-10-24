// Build-time render of a route to HTML (see scripts/prerender.mjs).
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { LangProvider } from './i18n.jsx'
import App from './App.jsx'

export { PAGES, SITE_URL, OG_IMAGE, jsonLdFor } from './seo.js'

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <LangProvider>
        <App />
      </LangProvider>
    </StaticRouter>,
  )
}
