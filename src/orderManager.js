const pool = require("../database");

async function orderIdExists(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM purchase_orders WHERE id = ?",
      [id]
    );
    return rows.length > 0;
  } finally {
    connection.release();
  }
}

async function trackNumberExists(track_number, idToExclude = null) {
  const connection = await pool.getConnection();
  try {
    let query = "SELECT * FROM purchase_orders  WHERE track_number = ?";
    let params = [track_number];

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

async function getOrder(id) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT *
       FROM purchase_orders WHERE id = ?`,
      [id]
    );

    const [rowsDetail] = await connection.execute(
      `SELECT *
       FROM order_details WHERE order_id = ?`,
      [id]
    );

    if (rows.length == 0) {
      console.log(`\nOrder: ${id} does not exist\n`);
    } else if (rows.length > 0 && rowsDetail.length == 0) {
      console.table(rows);
      console.log(`\nThis order doesn't have orderDetails\n`);
      return rows;
    } else {
      console.table(rows);
      console.table(rowsDetail);
      return rows;
    }
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Add an order and its details
async function addOrder(
  date,
  delivery_address,
  track_number,
  status,
  customerId,
  orderDetails
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      "INSERT INTO purchase_orders (date, delivery_address, track_number, status, customer_id) VALUES (?, ?, ?, ?, ?)",
      [date, delivery_address, track_number, status, customerId]
    );

    const orderId = orderResult.insertId;

    // Add all order details
    for (const detail of orderDetails) {
      const { productId, quantity, price } = detail;
      await connection.execute(
        "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, productId, quantity, price]
      );
    }

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateOrder(
  orderId,
  date,
  delivery_address,
  track_number,
  status,
  customerId,
  orderDetails
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update the main order
    await connection.execute(
      "UPDATE purchase_orders SET date = ?, delivery_address = ?, track_number = ?, status = ?, customer_id = ? WHERE id = ?",
      [date, delivery_address, track_number, status, customerId, orderId]
    );

    // Delete all existing details of the order
    await connection.execute("DELETE FROM order_details WHERE order_id = ?", [
      orderId,
    ]);

    // Re-insert updated order details
    for (const detail of orderDetails) {
      const { productId, quantity, price } = detail;
      await connection.execute(
        "INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, productId, quantity, price]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteOrder(orderId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute("DELETE FROM order_details WHERE order_id = ?", [
      orderId,
    ]);

    const [result] = await connection.execute(
      "DELETE FROM purchase_orders WHERE id = ?",
      [orderId]
    );

    if (result.affectedRows > 0) {
      console.log(`Order (ID: ${orderId}) deleted successfully.`);
    } else {
      console.log(`No order found with ID: ${orderId}`);
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error(`Error deleting order with ID ${orderId}: ${error.message}`);
  } finally {
    connection.release();
  }
}

module.exports = {
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  orderIdExists,
  trackNumberExists,
};
