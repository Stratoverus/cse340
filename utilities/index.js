const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="nav-list">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += '<li>'
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      '</a>'
    list += '</li>'
  })
  list += '</ul>'
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildDetailView = async function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Vehicle not found.</p>';
  }
  // Format price and miles
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price);
  const miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);
  // HTML structure for detail view
  let html = `<div class="vehicle-detail-container">
    <div class="vehicle-detail-image">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
    </div>
    <div class="vehicle-detail-info">
      <h2>${price}</h2>
      <ul>
        <li><strong>Mileage:</strong> ${miles} miles</li>
        <li><strong>Color:</strong> ${vehicle.inv_color}</li>
      </ul>
      <p class="vehicle-description">${vehicle.inv_description}</p>
    </div>
  </div>`;
  return html;
}

/* **************************************
* Build the Account Login view HTML
* ************************************ */
Util.buildLoginView = async function() {
  let html = `
    <form class="login-form" action="/account/login" method="post">
      <div class="form-group">
        <label for="account_email">Email:</label>
        <input type="email" id="account_email" name="account_email" required>
      </div>
      
      <div class="form-group">
        <label for="account_password">Password:</label>
        <input type="password" id="account_password" name="account_password" required>
      </div>
      
      <div class="form-group">
        <input type="submit" value="Login" class="login-btn">
      </div>
    </form>
    
    <p class="signup-link">
      No account? <a href="/account/register" class="signup-underline">Sign-up</a>
    </p>
  `;
  return html;
}

/* **************************************
* Build the Register view HTML
* ************************************ */
Util.buildRegisterView = async function(formData = {}) {
  const firstname = formData.account_firstname || '';
  const lastname = formData.account_lastname || '';
  const email = formData.account_email || '';
  
  let html = `
    <form class="register-form" action="/account/register" method="post">
      <div class="form-group">
        <label for="account_firstname">First Name:</label>
        <input type="text" id="account_firstname" name="account_firstname" required value="${firstname}">
      </div>
      
      <div class="form-group">
        <label for="account_lastname">Last Name:</label>
        <input type="text" id="account_lastname" name="account_lastname" required value="${lastname}">
      </div>
      
      <div class="form-group">
        <label for="account_email">Email Address:</label>
        <input type="email" id="account_email" name="account_email" required placeholder="Enter a valid email address" value="${email}">
      </div>
      
      <div class="form-group">
        <label for="account_password">Password:</label>
        <div class="password-container">
          <input type="password" id="account_password" name="account_password" required pattern="^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$">
          <button type="button" class="password-toggle" id="password-toggle" onclick="togglePassword()">Show</button>
        </div>
        <div class="password-requirements">
          <p>Password must be at least 12 characters and contain:</p>
          <ul>
            <li>At least 1 capital letter</li>
            <li>At least 1 number</li>
            <li>At least 1 special character</li>
          </ul>
        </div>
      </div>
      
      <div class="form-group">
        <input type="submit" value="Register" class="register-btn">
      </div>
    </form>
    
    <p class="login-link">
      Already have an account? <a href="/account/login" class="login-underline">Sign in</a>
    </p>
  `;
  return html;
}

/* ****************************************
 * Build Classification List for Select Element
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check Account Type (Employee or Admin)
 * ************************************ */
 Util.checkAccountType = (req, res, next) => {
  if (res.locals.loggedin && res.locals.accountData) {
    const accountType = res.locals.accountData.account_type
    if (accountType === 'Employee' || accountType === 'Admin') {
      next()
    } else {
      req.flash("notice", "You do not have permission to access this page.")
      return res.redirect("/account/login")
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util