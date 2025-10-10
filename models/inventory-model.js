const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get classification by classification_id
 * ************************** */
async function getClassificationById(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification WHERE classification_id = $1",
      [classification_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getClassificationById error " + error)
  }
}

/* ***************************
 *  Get a single inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getInventoryById error " + error);
  }
}

/* ***************************
 *  Add a new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const data = await pool.query(sql, [classification_name])
    return data.rowCount
  } catch (error) {
    console.error("addClassification error: " + error)
    return false
  }
}

/* ***************************
 *  Add a new inventory item
 * ************************** */
async function addInventory(
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
) {
  try {
    const sql = `INSERT INTO inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    const data = await pool.query(sql, [
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
    ])
    return data.rowCount
  } catch (error) {
    console.error("addInventory error: " + error)
    return false
  }
}

/* ***************************
 *  Update inventory item
 * ************************** */
async function updateInventory(
  inv_id,
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete inventory item
 * ************************** */
async function deleteInventory(
  inv_id
) {
  try {
    const sql =
      "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [
      inv_id
    ])
    return data
  } catch (error) {
    console.error("Delete Inventory Error")
  }
}

/* ***************************
 *  Get all classifications with vehicle counts
 * ************************** */
async function getAllClassificationsWithCount() {
  try {
    const sql = `
      SELECT 
        c.classification_id,
        c.classification_name,
        COUNT(i.inv_id) as vehicle_count
      FROM public.classification c
      LEFT JOIN public.inventory i ON c.classification_id = i.classification_id
      GROUP BY c.classification_id, c.classification_name
      ORDER BY c.classification_name
    `
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getAllClassificationsWithCount error: " + error)
    return []
  }
}

/* ***************************
 *  Update classification
 * ************************** */
async function updateClassification(classification_id, classification_name) {
  try {
    const sql = `
      UPDATE public.classification 
      SET classification_name = $1 
      WHERE classification_id = $2 
      RETURNING *
    `
    const data = await pool.query(sql, [classification_name, classification_id])
    return data.rows[0]
  } catch (error) {
    console.error("updateClassification error: " + error)
    return false
  }
}

/* ***************************
 *  Delete classification
 * ************************** */
async function deleteClassification(classification_id) {
  try {
    const sql = "DELETE FROM public.classification WHERE classification_id = $1"
    const data = await pool.query(sql, [classification_id])
    return data.rowCount
  } catch (error) {
    console.error("deleteClassification error: " + error)
    return false
  }
}

/* ***************************
 *  Check if classification has vehicles
 * ************************** */
async function classificationHasVehicles(classification_id) {
  try {
    const sql = "SELECT COUNT(*) as count FROM public.inventory WHERE classification_id = $1"
    const data = await pool.query(sql, [classification_id])
    return parseInt(data.rows[0].count) > 0
  } catch (error) {
     // Going to assume it has vehicles if error, just in case. I feel it's safer. :P
    console.error("classificationHasVehicles error: " + error)
    return true
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById, 
  getClassificationById, 
  addClassification, 
  addInventory, 
  updateInventory, 
  deleteInventory,
  getAllClassificationsWithCount,
  updateClassification,
  deleteClassification,
  classificationHasVehicles
};