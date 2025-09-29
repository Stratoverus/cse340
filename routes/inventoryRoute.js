// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

// Route to process add classification form
router.post("/add-classification", 
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

// Route to process add inventory form
router.post("/add-inventory", 
    invValidation.inventoryRules(),
    invValidation.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view by inventory id
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailByInvId));

module.exports = router;