const pool = require("./database");

async function getProduct() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute("SELECT * FROM products");
    console.table(rows);
    return rows;
  } catch (error) {
    console.log("Erreur lors de l'affichage des produits:", error.message);
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
    // return result.insertId;
    console.log(`Product: with ${id} has been added`);
  } catch (error) {
    // throw error;
    console.log("Erreur for added product");
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
    // return result.affectedRows;
    console.log(`product: ${id}  has been updated`, result.affectedRows);
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
    // return result.affectedRows;
    console.log(`product: ${id}  has been deleted`);
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        `Erreur de suppression : le produit ${id} est référencé par une autre table.`
      );
    }
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getProduct, addProduct, updateProduct, deleteProduct };
