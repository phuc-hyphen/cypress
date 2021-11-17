/// <reference types="cypress" />
describe("Scénarion de connexion / déconnexion", () => {
    before("Login", () => {
        cy.Login()
    })
    it.only("Add employee and add details", () => {
        cy.AddEmployee("Jason", "De", "Lagan")
    })
    // it.only("Recherche salarié avec le nom", () => {
    //     cy.EmployeeSearchByName("Jason", "De", "Lagan")
    // })
    it.only("Recherche salarié avec l'ID", () => {
        cy.EmployeeSearchByID(Cypress.env("ID"))
    })
    // it.only("Ajout des coordonnées", () => {
    //     cy.EmployeeAddress(
    //         Cypress.env("ID"),
    //         "French",
    //         "93127",
    //         "18 Rue victoire"
    //     )
    // })
    it.only("Supprimer employée par ID ", () => {
        cy.DeleteEmployee(Cypress.env("ID"))
    })
    after("Se déconnecter", () => {
        cy.Logout()
    })
})
