describe('Sign Up Page', () => {
    beforeEach(() => {
        cy.viewport(1280, 720)
      })
    it('allows user to sign up', () => {
      cy.visit('/register');
      cy.get('input#email')
        .type('testuser@example.com')
        .should('have.value', 'testuser@example.com');

        cy.get('input#password')
        .type('testpassword')
        .should('have.value', 'testpassword');

        cy.get('input#fullName')
        .type('John Smith')
        .should('have.value', 'John Smith');

        cy.get('input#companyName')
        .type('Banyan Storage')
        .should('have.value', 'Banyan Storage');

        cy.get('input#jobTitle')
        .type('Software Developer')
        .should('have.value', 'Software Developer');

        cy.get('input#phoneNumber')
        .type('1233456789')
        .should('have.value', '1233456789');
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/dashboard')
       
    });
  });