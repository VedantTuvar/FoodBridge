describe('FoodBridge Full E2E Donation & Logistics Flow', () => {

  it('Visits landing page and verifies brand title', () => {
    cy.visit('/');
    cy.contains('FoodBridge').should('be.visible');
  });

  it('Navigates to donor create donation form', () => {
    cy.visit('/donor/donations/new');
    cy.get('h2').should('contain', 'Donate Surplus Food');
  });

  it('Browses NGO geospatial map and checks proximity radius', () => {
    cy.visit('/ngo/map');
    cy.contains('Surplus Food Proximity Map').should('be.visible');
    cy.contains('10 km').should('be.visible');
  });

  it('Inspects admin operations dashboard', () => {
    cy.visit('/admin/dashboard');
    cy.contains('Platform Operations Dashboard').should('be.visible');
  });

});
