describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')

    cy.get('[data-testid="cypress-1"]').should('exist')
    .should("have.text", "Categories")
  })
})