const pool = require("./database");

async function getPayment() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute("SELECT * FROM payments");
    console.table(rows);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function addPayment(date, amount, payment_method, order_id) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO   payments (date, amount, payment_method, order_id) VALUES (?, ?, ?, ?)",
      [date, amount, payment_method, order_id]
    );
    console.log("Payment: with ${id} has been added", result.insertId);
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function updatePayment(id, date, amount, payment_method, order_id) {
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
        `Error of deleted : the payment ${id} is référence by another table.`
      );
    }
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getPayment, addPayment, updatePayment, deletePayment };
