const pool = require("../database");

async function customerIdExists(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM customers WHERE id = ?",
      [id]
    );
    return rows.length > 0;
  } finally {
    connection.release();
  }
}

async function phoneExists(phone, idToExclude = null) {
  if (!phone) {
    return false;
  }

  const connection = await pool.getConnection();
  try {
    let query = "SELECT * FROM customers WHERE phone = ?";
    let params = [phone];

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

async function emailExists(email, idToExclude = null) {
  const connection = await pool.getConnection();
  try {
    let query = "SELECT * FROM customers WHERE email = ?";
    let params = [email];

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

async function getCustomer() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute("SELECT * FROM customers");
    console.table(rows);
    return rows;
  } catch (error) {
    console.log("Error displaying customers:", error.message);
  } finally {
    connection.release();
  }
}

async function addCustomer(name, address, email, phone) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)",
      [name, address, email, phone]
    );
    console.log(`Customer has been created successfully`);
  } catch (error) {
    // console.error("Error adding customer:", error.message);
    if (error.code === "ER_DUP_ENTRY") {
      console.error("Error adding customer: Email or phone already exists.");
    } else {
      console.error("Error adding customer:", error.message);
    }
    throw error;
  } finally {
    connection.release();
  }
}

async function updateCustomer(id, name, address, email, phone) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?",
      [name, address, email, phone, id]
    );
    if (result.affectedRows > 0) {
      console.log(`Customer with ID: ${id} has been updated successfully.`);
    } else {
      console.log(`Failed to update customer with ID: ${id}.`);
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteCustomer(id) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      console.log(`Customer with ID: ${id} has been deleted successfully.`);
    } else {
      console.log(`Failed to delete customer with ID: ${id}.`);
    }
  } catch (error) {
    console.error("Error deleting customer:", error.message);
  } finally {
    connection.release();
  }
}

module.exports = {
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  customerIdExists,
  emailExists,
  phoneExists,
};
