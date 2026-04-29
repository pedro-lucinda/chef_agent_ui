//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  /** Aligns with typical TS/React line length; matches tooling like Black @ 100 */
  printWidth: 100,
  /** React 19 + Vite: stable JSX formatting */
  bracketSameLine: false,
}

export default config
