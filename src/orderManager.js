const pool = require("./database");

async function getOrder() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT po.id AS order_id, po.date, po.delivery_address, po.track_number, po.status, po.customer_id, 
              od.product_id, od.quantity, od.price
       FROM purchase_orders po
       LEFT JOIN order_details od ON po.id = od.order_id
       ORDER BY po.id`
    );

    console.table(rows);
    return rows;
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

    // Delete the order details first
    await connection.execute("DELETE FROM order_details WHERE order_id = ?", [
      orderId,
    ]);

    // Then, delete the main order
    await connection.execute("DELETE FROM purchase_orders WHERE id = ?", [
      orderId,
    ]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { getOrder, addOrder, updateOrder, deleteOrder };
