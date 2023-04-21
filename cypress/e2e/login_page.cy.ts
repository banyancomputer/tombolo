import firebase from 'firebase/app';
import 'firebase/auth';

describe('Logging in as a user with no demo data', () => {
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


        cy.get('a[href="/upload-portal"]').click();
        cy.url().should('include', '/upload-portal');

        cy.get('a[href="/account"]').click();
        cy.url().should('include', '/account');

        cy.get('a[href="mailto:support@tombolo.store"]').click();
        cy.url().should('include', 'mailto:support@tombolo.store');

        cy.get('div').contains('Log Out').click();
        cy.url().should('include', '/login');


        
    });
  });




  