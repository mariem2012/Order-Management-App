const pool = require("./database");

// Récupérer tous les paiements
async function getPayments() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute(
      "SELECT * FROM   payments"
    );
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Ajouter un paiement
async function addPayment(date, amount, payment_method) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO   payments (date, amount, payment_method, order_id) VALUES (?, ?, ?)",
      [date, amount, payment_method, order_id]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Mettre à jour un paiement
async function updatePayment(id, date, amount, payment_method) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE  payments SET date = ?, amount = ?, payment_method = ?, order_id = ?, WHERE id = ?",
      [date, amount, payment_method, order_id, id]
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Supprimer un paiement
async function deletePayment(id) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM  payments WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        `Erreur de suppression : le paiement ${id} est référencé par une autre table.`
      );
    }
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getPayments, addPayment, updatePayment, deletePayment };
