describe('About page', () => {
  beforeEach(() => {
    cy.visit('/about')
  })

  it('renders the heading', () => {
    cy.contains('h1', 'About Page').should('be.visible')
  })

  it('navigates back to the home page', () => {
    cy.contains('a', 'Home').click()

    cy.location('pathname').should('eq', '/')
    cy.contains('h1', 'Home Page').should('be.visible')
  })
})
