describe("Connect Wallet Modal Open Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });

  it("open Connect Wallet Modal", () => {
    cy.get('[class*="connected_wallet"]').should("exist");
    cy.get('[class*="connected_wallet"]').click();
    cy.wait(10000);
    cy.get('[class*="connect-wallet-outer-container"]').should("exist");
  });
});
