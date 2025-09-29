const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  
  const result = await invModel.addClassification(classification_name)
  
  if (result) {
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    let nav = await utilities.getNav() // Regenerate nav to include new classification
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
      errors: null,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body
  
  const result = await invModel.addInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )
  
  if (result) {
    req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully added to inventory.`)
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the vehicle failed.")
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
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
  }
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()
  
  // Check if classification exists
  if (!data || !Array.isArray(data) || data.length === 0) {
    // Verify that the classification actually exists
    const classification = await invModel.getClassificationById(classification_id)
    
    if (!classification) {
      // Classification doesn't exist - throw 404
      const error = new Error("Classification not found");
      error.status = 404;
      error.message = "Sorry, the classification you are looking for does not exist.";
      throw error;
    } else {
      // Classification exists but has no vehicles - show friendly message
      const grid = '<p class="notice">Sorry, no matching vehicles could be found in this classification.</p>'
      res.render("./inventory/classification", {
        title: classification.classification_name + " vehicles",
        nav,
        grid,
      })
      return;
    }
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view by inv_id
 * ************************** */
invCont.buildDetailByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryById(inv_id);
  let nav = await utilities.getNav();
  
  // Mirroring what I did in the classification area
  if (!data) {
    const error = new Error("Vehicle not found");
    error.status = 404;
    error.message = "Sorry, the vehicle you are looking for does not exist.";
    throw error;
  }
  
  const vehicle = data;
  const detailHtml = await utilities.buildDetailView(vehicle);
  res.render("./inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detailHtml
  });
}

module.exports = invCont