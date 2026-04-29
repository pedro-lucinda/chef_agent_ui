import ReactDOM from 'react-dom/client'

import { router } from '#/lib/router'
import { initSentry } from '#/lib/sentry'
import App from './App'

initSentry(router)

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
