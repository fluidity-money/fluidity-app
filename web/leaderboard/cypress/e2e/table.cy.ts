describe("Table Component E2E Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });

  it("should display the correct table headings", () => {
    const headings = [
      "RANK",
      "USER",
      "#TX",
      "VOLUME (USD)",
      "YIELD EARNED (USD)",
    ];
    headings.forEach((heading) => {
      cy.contains("th", heading).should("be.visible");
    });
  });

  it("should display data rows correctly when data is loaded", () => {
    cy.get('[class*="page_table_row"]').should("have.length.at.least", 1);
  });

  it("should show a loading state when data is being fetched", () => {
    cy.contains("Fetching table data...").should("be.visible");
  });
});
