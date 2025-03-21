// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Add any custom commands you need here
Cypress.Commands.add("getByDataCy", (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args);
});

declare namespace Cypress {
  interface Chainable {
    getByDataCy(selector: string): Chainable<JQuery<HTMLElement>>;
  }
}
