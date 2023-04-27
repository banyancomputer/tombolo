
import 'firebase/database';
import * as firebase from "firebase/app";


describe('Logging in desktop as a user with no demo data', () => {
    before(() => {
      const firebaseConfig = {
        apiKey: 'AIzaSyDMgRMzx9PF6s9pRY_7-CbTo-D1O1NCsT4',
        authDomain: 'tombolo-ab010.firebaseapp.com',
        projectId: 'tombolo-ab010',
        storageBucket: 'tombolo-ab010.appspot.com',
        messagingSenderId: '310861877732',
        appId: '1:310861877732:web:bb5c215a33a90f47ea37f1',
      };
      firebase.initializeApp(firebaseConfig);
      
    });

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




  