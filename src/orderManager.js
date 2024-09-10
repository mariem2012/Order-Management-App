const pool = require("./database");

// Récupérer toutes les commandes
async function getOrders() {
  const connection = await pool.getConnection();
  try {
    const [rows, _fields] = await connection.execute(
      "SELECT * FROM  purchase_orders"
    );
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

// Ajouter une commande avec ses détails
async function addOrder(
  date,
  delivery_address,
  track_number,
  status,
  orderDetails
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Ajouter la commande principale
    const [orderResult] = await connection.execute(
      "INSERT INTO  purchase_orders (date, delivery_address, track_number, status) VALUES (?, ?, ?, ?)",
      [date, delivery_address, track_number, status]
    );

    const orderId = orderResult.insertId;

    // Ajouter les détails de la commande associés
    for (const detail of orderDetails) {
      const { productId, quantity, price } = detail;
      await connection.execute(
        "INSERT INTO  order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
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

// Mettre à jour une commande et ses détails
async function updateOrder(
  orderId,
  date,
  delivery_address,
  track_number,
  status,
  orderDetails
) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Mettre à jour la commande principale
    await connection.execute(
      "UPDATE  purchase_orders SET date = ?, delivery_address = ?, track_number = ?, status = ? WHERE id = ?",
      [date, delivery_address, track_number, status, orderId]
    );

    // Supprimer les détails de la commande existants
    await connection.execute("DELETE FROM  order_details WHERE order_id = ?", [
      orderId,
    ]);

    // Réinsérer les détails de la commande mis à jour
    for (const detail of orderDetails) {
      const { productId, quantity, price } = detail;
      await connection.execute(
        "INSERT INTO  order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
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

// Supprimer une commande et ses détails
async function deleteOrder(orderId) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Supprimer d'abord les détails de la commande
    await connection.execute("DELETE FROM  order_details WHERE order_id = ?", [
      orderId,
    ]);

    // Ensuite, supprimer la commande principale
    await connection.execute("DELETE FROM  purchase_orders WHERE id = ?", [
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

module.exports = { getOrders, addOrder, updateOrder, deleteOrder };
