// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")


// Route to build inventory management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassificationView));

// Route to process add classification form
router.post("/add-classification", 
    utilities.checkAccountType,
    invValidation.classificationRules(),
    invValidation.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventoryView));

// Route to process add inventory form
router.post("/add-inventory", 
    utilities.checkAccountType,
    invValidation.inventoryRules(),
    invValidation.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

//Route to get inventory list
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle detail view by inventory id
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildDetailByInvId));

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.buildEditInventoryView));

//Route to update the inventory
router.post("/update/", utilities.checkAccountType, utilities.handleErrors(invController.updateInventory));

//Route to delete inventory
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteInvetoryView));

// Route to process the delete
router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteInventory))

module.exports = router;