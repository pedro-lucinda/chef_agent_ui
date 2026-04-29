/**
 * Custom Cypress commands.
 *
 * Add reusable helpers here, then declare their type signatures on the
 * `Cypress.Chainable` interface below so tests get full IntelliSense.
 *
 * @example
 *   Cypress.Commands.add('login', (email, password) => {
 *     cy.session([email, password], () => {
 *       cy.request('POST', '/api/login', { email, password })
 *     })
 *   })
 */

export {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // Declare custom commands here, e.g.
      // login(email: string, password: string): Chainable<void>
    }
  }
}
