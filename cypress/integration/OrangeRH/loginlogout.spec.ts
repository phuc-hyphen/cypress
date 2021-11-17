/// <reference types="cypress" />
describe("Scénarion de connexion / déconnexion", () => {
    before("Ouvrir la page d'accueil", () => {
        cy.visit("/")
    })
    it("se connecter ", () => {
        cy.HTTPlogin()
    })
    it("se déconnecter ", () => {
        cy.HTTPlogout()
    })
    after("S'exécute une seule fois à la fin du scénario", () => {})
})
