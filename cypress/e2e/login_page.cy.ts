describe('Login Page', () => {
    beforeEach(() => {
        cy.viewport(1280, 720)
      })
    it('allows user to sign in', () => {
      cy.visit('/login');
      cy.get('input#email')
        .type('testuser@example.com')
        .should('have.value', 'testuser@example.com');

        cy.get('input#password')
        .type('testpassword')
        .should('have.value', 'testpassword');
       
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/')
    });
  });

  