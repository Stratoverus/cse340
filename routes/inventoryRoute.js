// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inventory-validation")


// Route to build inventory management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Route to build vehicle management view
router.get("/manage-vehicles", utilities.checkAccountType, utilities.handleErrors(invController.buildManageVehiclesView));

// Route to build add classification view (Admin only)
router.get("/add-classification", utilities.checkAdminType, utilities.handleErrors(invController.buildAddClassificationView));

// Route to process add classification form (Admin only)
router.post("/add-classification", 
    utilities.checkAdminType,
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

// Route to build manage classifications view (Admin only)
router.get("/manage-classifications", utilities.checkAdminType, utilities.handleErrors(invController.buildManageClassificationsView));

// Route to build edit classification view (Admin only)
router.get("/edit-classification/:classification_id", utilities.checkAdminType, utilities.handleErrors(invController.buildEditClassificationView));

// Route to build delete classification confirmation view (Admin only)
router.get("/delete-classification/:classification_id", utilities.checkAdminType, utilities.handleErrors(invController.buildDeleteClassificationView));

// Route to process update classification (Admin only)
router.post("/update-classification", 
    utilities.checkAdminType,
    invValidation.classificationUpdateRules(),
    invValidation.checkClassificationUpdateData,
    utilities.handleErrors(invController.updateClassification)
);

// Route to process delete classification (Admin only)
router.post("/delete-classification", utilities.checkAdminType, utilities.handleErrors(invController.deleteClassification));

module.exports = router;