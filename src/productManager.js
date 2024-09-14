const pool = require("../database");

async function productIdExists(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return rows.length > 0;
  } finally {
    connection.release();
  }
}

async function barcodeExists(barcode, idToExclude = null) {
  const connection = await pool.getConnection();
  try {
    let query = "SELECT * FROM products WHERE barcode = ?";
    let params = [barcode];

    if (idToExclude) {
      query += " AND id != ?";
      params.push(idToExclude);
    }

    const [rows] = await connection.execute(query, params);
    return rows.length > 0;
  } finally {
    connection.release();
  }
}

async function getProduct() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute("SELECT * FROM products");
    console.table(rows);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function addProduct(
  name,
  description,
  price,
  stock,
  category,
  barcode,
  status
) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO products (name, description, price, stock, category, barcode, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, stock, category, barcode, status]
    );

    if (result.affectedRows > 0) {
      console.log(`Product with has been added successfully.`);
    } else {
      console.log(`Failed to add product with ID: ${id}.`);
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function updateProduct(
  id,
  name,
  description,
  price,
  stock,
  category,
  barcode,
  status
) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, barcode = ?, status = ? WHERE id = ?",
      [name, description, price, stock, category, barcode, status, id]
    );

    if (result.affectedRows > 0) {
      console.log(`Product with ID: ${id} has been update successfully.`);
    } else {
      console.log(`Failed to update product with ID: ${id}.`);
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteProduct(id) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      console.log(`Product with ID: ${id} has been deleted successfully.`);
    } else {
      console.log(`Failed to delete product with ID: ${id}.`);
    }
  } catch (error) {
    console.error("Error deleting product:", error.message);
  } finally {
    connection.release();
  }
}

module.exports = {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  productIdExists,
  barcodeExists,
};
