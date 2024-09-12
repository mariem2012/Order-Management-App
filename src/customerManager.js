const pool = require("./database");

async function customerIdExist(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT 1 FROM customers WERE id = ?",
      [id]
    );

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
    console.log("Erreur lors de l'affichage des clients:", error.message);
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
    // return result;
    console.log(`Customer: has been created successfully`);
  } catch (error) {
    console.error("Error added customer:", error.result);
  } finally {
    connection.release();
  }
}

async function updateCustomer(id, name, address, email, phone) {
  customerIdExist();
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id FROM customers WHERE id = ?",
      [id]
    );
    if (rows.length === 0) {
      throw new Error(`Customer: ${id}, don't existe`);
    }

    const [result] = await connection.execute(
      "UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?",
      [name, address, email, phone, id]
    );
    return result.affectedRows;
    // console.log(`customer: ${id}, has been updated`);
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteCustomer(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT id FROM customers WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error(`Le client avec l'identifiant ${id} n'existe pas.`);
    }

    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );
    // return result.affectedRows;
    console.log(`Customer with ID: ${id}  has been deleted successfully`);
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

module.exports = { getCustomer, addCustomer, updateCustomer, deleteCustomer };

// function validateId(id) {
//   if (!id) {
//     throw new Error("ID is required.");
//   }
// }

// function validateCustomerFields(name, address, email, phone) {
//   if (!name || !address || !email || !phone) {
//     throw new Error("All fields (name, address, email, phone) are required.");
//   }
// }

// async function getCustomer() {
//   const connection = await pool.getConnection();
//   try {
//     const [rows, _fields] = await connection.execute("SELECT * FROM customers");
//     console.table(rows);
//     return rows;
//   } catch (error) {
//     console.log("Error displaying customers:", error.message);
//   } finally {
//     connection.release();
//   }
// }

// async function addCustomer(name, address, email, phone) {
//   validateCustomerFields(name, address, email, phone);

//   const connection = await pool.getConnection();
//   try {
//     const [result] = await connection.execute(
//       "INSERT INTO customers (name, address, email, phone) VALUES (?, ?, ?, ?)",
//       [name, address, email, phone]
//     );
//     return result;
//   } catch (error) {
//     console.error("Error adding customer:");
//     throw error;
//   } finally {
//     connection.release();
//   }
// }

// async function updateCustomer(id, name, address, email, phone) {
//   validateId(id);
//   validateCustomerFields(name, address, email, phone);

//   const connection = await pool.getConnection();
//   try {
//     const [rows] = await connection.execute(
//       "SELECT id FROM customers WHERE id = ?",
//       [id]
//     );
//     if (rows.length === 0) {
//       throw new Error(`Customer with ID ${id} does not exist.`);
//     }

//     const [result] = await connection.execute(
//       "UPDATE customers SET name = ?, address = ?, email = ?, phone = ? WHERE id = ?",
//       [name, address, email, phone, id]
//     );
//     return result.affectedRows;
//   } catch (error) {
//     console.error("Error updating customer:", error.message);
//     throw error;
//   } finally {
//     connection.release();
//   }
// }

// async function deleteCustomer(id) {
//   validateId(id);

//   const connection = await pool.getConnection();
//   try {
//     const [rows] = await connection.execute(
//       "SELECT id FROM customers WHERE id = ?",
//       [id]
//     );

//     if (rows.length === 0) {
//       throw new Error(`Customer with ID ${id} does not exist.`);
//     }

//     const [result] = await connection.execute(
//       "DELETE FROM customers WHERE id = ?",
//       [id]
//     );

//     console.log(
//       `Customer with ID ${id} has been successfully deleted.`,
//       result
//     );
//   } catch (error) {
//     if (error.code === "ER_ROW_IS_REFERENCED_2") {
//       throw new Error(
//         `Delete error: Customer ${id} is referenced by another table.`
//       );
//     }
//     console.error("Error deleting customer:", error.message);
//     throw error;
//   } finally {
//     connection.release();
//   }
// }

// module.exports = { getCustomer, addCustomer, updateCustomer, deleteCustomer };
