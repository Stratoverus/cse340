const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()
  
  // Added this cause if I didn't have it and did a random number, it would crash
  if (!data || !Array.isArray(data) || data.length === 0) {
    const error = new Error("Classification not found");
    error.status = 404;
    error.message = "Sorry, the classification you are looking for does not exist.";
    throw error;
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