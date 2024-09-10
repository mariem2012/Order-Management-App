const pool = require("./database");

// Récupérer tous les produits
async function getProducts() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute("SELECT * FROM products");
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Ajouter un produit
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
    return result.insertId;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Mettre à jour un produit
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
    return result.affectedRows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Supprimer un produit
async function deleteProduct(id) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM products WHERE id = ?",
      [id]
    );
    return result.affectedRows;
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

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
