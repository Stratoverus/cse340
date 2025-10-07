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

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//Route to build account page
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

//Route to build update account view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccountView))

//Route to process account update
router.post("/update",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount))

//Route to process password change
router.post("/change-password",
    utilities.checkLogin,
    regValidate.passwordChangeRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.changePassword))

//Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router;