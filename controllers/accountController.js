const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  let login = await utilities.buildLoginView()
  res.render("account/login", {
    title: "Login",
    nav,
    login,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  let register = await utilities.buildRegisterView()
  res.render("account/register", {
    title: "Register",
    nav,
    register,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    let login = await utilities.buildLoginView()
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      login,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    let register = await utilities.buildRegisterView()
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      register,
      errors: null
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }