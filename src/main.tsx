import ReactDOM from 'react-dom/client'

import { router } from '#/lib/router'
import { initSentry } from '#/lib/sentry'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App'

initSentry(router)

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      useRefreshTokens
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      }}
    >
      <App />
    </Auth0Provider>
  )
}
