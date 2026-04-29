describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the heading', () => {
    cy.contains('h1', 'Home Page').should('be.visible')
  })

  it('renders the call-to-action button', () => {
    cy.contains('button', 'Click me').should('be.visible')
  })

  it('navigates to the about page', () => {
    cy.contains('a', 'About').click()

    cy.location('pathname').should('eq', '/about')
    cy.contains('h1', 'About Page').should('be.visible')
  })
})
