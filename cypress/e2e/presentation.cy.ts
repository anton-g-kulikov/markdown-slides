describe("Presentation Viewer", () => {
  beforeEach(() => {
    // Visit the first available presentation
    cy.visit("/");
    cy.get("[data-cy=presentation-card]").first().click();
  });

  it("should display the presentation title", () => {
    cy.get("[data-cy=presentation-title]").should("exist");
  });

  it("should navigate between slides using buttons", () => {
    // Get initial slide content for comparison
    cy.get("[data-cy=slide-content]").invoke("text").as("firstSlideContent");

    // Click next button
    cy.get("[data-cy=next-slide-btn]").click();

    // Content should change
    cy.get("[data-cy=slide-content]")
      .invoke("text")
      .then((text) => {
        cy.get("@firstSlideContent").should("not.eq", text);
      });

    // Click previous button
    cy.get("[data-cy=prev-slide-btn]").click();

    // Should return to first slide
    cy.get("[data-cy=slide-content]")
      .invoke("text")
      .then((text) => {
        cy.get("@firstSlideContent").should("eq", text);
      });
  });

  it("should navigate between slides using keyboard", () => {
    // Get initial slide content for comparison
    cy.get("[data-cy=slide-content]").invoke("text").as("firstSlideContent");

    // Press right arrow key
    cy.get("body").type("{rightarrow}");

    // Content should change
    cy.get("[data-cy=slide-content]")
      .invoke("text")
      .then((text) => {
        cy.get("@firstSlideContent").should("not.eq", text);
      });

    // Press left arrow key
    cy.get("body").type("{leftarrow}");

    // Should return to first slide
    cy.get("[data-cy=slide-content]")
      .invoke("text")
      .then((text) => {
        cy.get("@firstSlideContent").should("eq", text);
      });
  });

  it("should return to homepage when clicking home button", () => {
    cy.get("[data-cy=home-btn]").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
