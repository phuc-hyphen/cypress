// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference path="../support/index.d.ts" />

Cypress.Commands.add("Login", () => {
    cy.visit("/auth/login")
    cy.get("#txtUsername").type("admin")
    cy.get("#txtPassword").type("admin123")
    cy.get("#btnLogin").click()
    cy.get("#menu_admin_viewAdminModule > b").should("have.text", "Admin")
})
Cypress.Commands.add("Logout", () => {
    cy.get("#welcome").click()
    cy.get("#welcome-menu > :nth-child(1) > :nth-child(3)>a")
        .should("have.text", "Logout")
        .click()
    cy.get("#divLogo >img").should("be.visible")
})
Cypress.Commands.add("AddEmployee", (FirstName, MiddleName, LastName) => {
    // cy.get("#menu_pim_viewPimModule ").click()
    cy.get("#menu_pim_addEmployee")
        .should("have.text", "Add Employee")
        .click({ force: true })
    cy.get("#firstName").type(FirstName)
    cy.get("#middleName").type(MiddleName)
    cy.get("#lastName").type(LastName)
    cy.get("#btnSave").should("have.value", "Save").click()
    cy.get("#personal_txtEmpFirstName").should("be.disabled")
    cy.get("#personal_txtEmpLastName").should("be.disabled")
    cy.get("#personal_txtEmpMiddleName").should("be.disabled")
    cy.get("#btnSave").should("have.value", "Edit").click({ force: true })
    cy.get("#personal_txtEmpFirstName").should("be.enabled")
    cy.get("#personal_txtEmpLastName").should("be.enabled")
    cy.get("#personal_optGender_1").click()
    cy.get("#personal_cmbMarital")
        .select("Single")
        .should("have.value", "Single")
    cy.get("#personal_cmbNation").select("French").should("have.value", "64")
    cy.get(
        "div.box.pimPane:nth-child(1) div.personalDetails:nth-child(2) div.inner form:nth-child(1) fieldset:nth-child(3) ol:nth-child(3) li:nth-child(4) > img.ui-datepicker-trigger:nth-child(3)"
    ).click()
    cy.get("#btnSave").should("have.value", "Save").click({ force: true })
})
Cypress.Commands.add(
    "EmployeeSearchByName",
    (FirstName, MiddleName, LastName) => {
        cy.get("#menu_pim_viewEmployeeList")
            .should("have.text", "Employee List")
            .click({ force: true })
        cy.get("#empsearch_employee_name_empName")
            .clear()
            .type(FirstName + MiddleName + LastName + "{enter}")
        // .type("Jason De Rien{enter}", { delay: 100 })

        cy.get("#searchBtn").should("have.value", "Search").click()

        cy.get(
            "div.box.noHeader:nth-child(2) div.inner table.table.hover tbody:nth-child(2) tr.odd:nth-child(1) td.left:nth-child(3) > a:nth-child(1)"
        ).click()
        cy.get(
            "div:nth-child(3) div.box.pimPane:nth-child(1) div:nth-child(1) div:nth-child(1) > h1:nth-child(1)"
        ).should("have.text", name)
        cy.get("#personal_txtEmployeeId").should("be.disabled")
    }
)
Cypress.Commands.add("EmployeeSearchByID", (ID) => {
    cy.get("#menu_pim_viewEmployeeList")
        .should("have.text", "Employee List")
        .click({ force: true })
    cy.get("#empsearch_id").clear().type(ID)
    // .type("Jason De Rien{enter}", { delay: 100 })
    cy.get("#searchBtn").should("have.value", "Search").click()

    cy.get(".odd>:nth-child(3) > :nth-child(1)").should("be.visible")

    // cy.get("#personal_txtEmployeeId").should("be.disabled")
})
Cypress.Commands.add("EmployeeAddress", (ID, country, code, address) => {
    cy.EmployeeSearchByID(ID)
    cy.get(
        "div.box.pimPane:nth-child(3) div:nth-child(1) ul:nth-child(2) li.selected:nth-child(2) > a:nth-child(1)"
    )
        .should("have.text", "Contact Details")
        .click({ force: true })
    cy.get("#contact_street1").should("be.disabled")
    cy.get("#btnSave").should("have.text", "Edit").click()
    cy.get("#contact_street1").should("be.enabled").clear().type(address)
    cy.get("#contact_emp_zipcode").clear().type(code)
    cy.get("#contact_country").select(country)
    cy.get("#btnSave").should("have.value", "Save").click()
    cy.get("#contact_street1").should("be.disabled")
})
Cypress.Commands.add("DeleteEmployee", (ID) => {
    cy.EmployeeSearchByID(ID)
    // cy.go("back")
    cy.get("#ohrmList_chkSelectAll").click()
    cy.get("#btnDelete").click()
    cy.get("#dialogDeleteBtn").click()
    cy.get(
        "div.box.noHeader:nth-child(2) div.inner div:nth-child(5) table.table.hover tbody:nth-child(2) tr:nth-child(1) > td:nth-child(1)"
    ).should("have.text", "No Records Found")
})
Cypress.Commands.add("HTTPlogout", () => {
    cy.request({ method: "GET", url: "/auth/logout" })
    cy.visit("/")
})
Cypress.Commands.add("HTTPlogin", () => {
    cy.request({ method: "GET", url: "/auth/login" }).then((resp) => {
        expect(resp.status).to.eq(200)
        const $html = Cypress.$(resp.body)
        const csrf = $html.find("input[id=csrf_token]").val()
        cy.log(csrf.toString())
        cy.request({
            method: "POST",
            url: "/auth/validateCredentials",
            form: true,
            body: {
                txtUsername: "admin",
                txtPassword: "admin123",
                _csrf_token: csrf,
                Submit: "CONNEXION",
            },
        }).then((resp) => {
            expect(resp.status).to.eq(200)
            cy.visit("/pim/viewEmployeeList")
        })
    })
    cy.visit("/")
})
