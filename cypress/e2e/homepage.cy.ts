describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the title", () => {
    cy.get("h1").contains("Markdown Slides");
  });

  it("should display presentation cards", () => {
    // Assuming there's at least one presentation
    cy.get("[data-cy=presentation-card]").should("exist");
  });

  it("should navigate to presentation when clicking a card", () => {
    // Click on the first presentation card
    cy.get("[data-cy=presentation-card]").first().click();

    // Should navigate to the presentation page
    cy.url().should("include", "/slides/");
  });
});
