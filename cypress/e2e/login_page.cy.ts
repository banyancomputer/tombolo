describe('Logging in desktop as a user with no demo data', () => {
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

        cy.get('a[href="/upload-portal"]').click();
        cy.url().should('include', '/upload-portal');

        cy.get('a[href="/account"]').click();
        cy.url().should('include', '/account');

        cy.get('div').contains('Log Out').click();
        cy.url().should('include', '/login');
        
    });
  });

  describe('Logging in desktop as a user WITH demo data', () => {
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

        cy.get('[data-testid="expander-button-1"]')
        .click(); 

        cy.get('button') 
        .contains('Open File View')
        .click(); 

        cy.get('a[href="/upload-portal"]').click();
        cy.url().should('include', '/upload-portal');

        cy.get('a[href="/account"]').click();
        cy.url().should('include', '/account');

        cy.get('div').contains('Log Out').click();
        cy.url().should('include', '/login');
        
    });
  });


  