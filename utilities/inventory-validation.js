const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    // Classification name is required and must be string
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
      .isLength({ min: 2, max: 30 })
      .withMessage("Classification name must be between 2 and 30 characters.")
      .custom(async (classification_name) => {
        // Check if classification already exists
        const classifications = await invModel.getClassifications()
        const exists = classifications.rows.some(
          classification => classification.classification_name.toLowerCase() === classification_name.toLowerCase()
        )
        if (exists) {
          throw new Error("Classification already exists. Please choose a different name.")
        }
        return true
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // Classification is required
    body("classification_id")
      .notEmpty()
      .withMessage("Classification is required.")
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification."),
    
    // Make is required
    body("inv_make")
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage("Make must be between 2 and 30 characters.")
      .matches(/^[a-zA-Z0-9\s\-&.]+$/)
      .withMessage("Make contains invalid characters."),
    
    // Model is required
    body("inv_model")
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage("Model must be between 2 and 30 characters.")
      .matches(/^[a-zA-Z0-9\s\-&.]+$/)
      .withMessage("Model contains invalid characters."),
    
    // Year is required and must be valid
    body("inv_year")
      .trim()
      .matches(/^\d{4}$/)
      .withMessage("Year must be a 4-digit number.")
      .custom((value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
          throw new Error(`Year must be between 1900 and ${currentYear + 1}.`);
        }
        return true;
      }),
    
    // Description is required
    body("inv_description")
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Description must be between 10 and 1000 characters."),
    
    // Image path is required
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required.")
      .matches(/^(\/|https?:\/\/)/i)
      .withMessage("Image path must start with '/' or 'http://' or 'https://'"),
    
    // Thumbnail path is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required.")
      .matches(/^(\/|https?:\/\/)/i)
      .withMessage("Thumbnail path must start with '/' or 'http://' or 'https://'"),
    
    // Price is required and must be positive
    body("inv_price")
      .notEmpty()
      .withMessage("Price is required.")
      .isInt({ min: 0, max: 999999999 })
      .withMessage("Price must be a positive number less than 999,999,999."),
    
    // Miles is required and must be positive
    body("inv_miles")
      .notEmpty()
      .withMessage("Miles is required.")
      .isInt({ min: 0, max: 999999999 })
      .withMessage("Miles must be a positive number less than 999,999,999."),
    
    // Color is required
    body("inv_color")
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage("Color must be between 2 and 30 characters.")
      .matches(/^[a-zA-Z0-9\s\-&.]+$/)
      .withMessage("Color contains invalid characters.")
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { 
    classification_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color 
  } = req.body
  
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}

/* ******************************
 * Check updated inventory data and return errors or continue
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    classification_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color,
    inv_id 
  } = req.body
  
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inv/edit", {
      errors,
      title: "Edit Vehicle",
      nav,
      classificationList,
      classification_id, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}

module.exports = validate