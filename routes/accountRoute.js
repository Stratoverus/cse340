// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build Account Login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build Account Registration
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to register account
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

module.exports = router;