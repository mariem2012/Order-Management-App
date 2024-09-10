const pool = require("./database");

async function get() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute("SELECT * FROM customers");
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function add(name, address, email, phone) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)",
      [name, address, email, phone]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function update(id, name, address, email, phone) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?",
      [name, address, email, phone, id]
    );
    return result.affectedRows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function destroy(id) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new Error(
        `Erreur de suppression : le client ${id} est référencé par une autre table.`
      );
    }
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { get, add, update, destroy };
