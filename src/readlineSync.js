const readlineSync = require("readline-sync");

const {
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} = require("./customerManager.js");

const {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("./productManager.js");

const {
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("./orderManager.js");

const {
  getPayment,
  addPayment,
  updatePayment,
  deletePayment,
} = require("./paymentManager.js");

async function customer() {
  try {
    let choose = 0;
    while (choose !== 5) {
      console.log(`----- Customer Menu -----`);
      console.log("1. Get customer");
      console.log("2. Add a customer");
      console.log("3. Update customer information");
      console.log("4. Delete a customer");
      console.log("5. Exit the customer menu");
      choose = readlineSync.questionInt("Choose an option: ");

      switch (choose) {
        case 1:
          await getCustomer();
          break;
        case 2:
          const name = readlineSync.question("Enter customer name: ");
          const address = readlineSync.question("Enter customer address: ");
          const email = readlineSync.questionEMail("Enter customer email: ");
          const phone = readlineSync.question("Enter customer phone: ");
          await addCustomer(name, address, email, phone);
          break;
        case 3:
          const id = readlineSync.questionInt("Enter customer ID: ");
          const newName = readlineSync.question(
            "Enter the new customer name: "
          );
          const newAddress = readlineSync.question("Enter the new address: ");
          const newEmail = readlineSync.questionEMail("Enter the new email: ");
          const newPhone = readlineSync.question(
            "Enter the new phone number: "
          );
          await updateCustomer(id, newName, newAddress, newEmail, newPhone);
          break;
        case 4:
          const iD = readlineSync.questionInt("Enter customer ID: ");
          await deleteCustomer(iD);
          break;
        case 5:
          console.log("\nExiting the customer menu...\n");
          break;
        default:
          console.log("\nYou did not choose a valid option\n");
          break;
      }
    }
  } catch (e) {
    throw e.message;
  }
}

async function product() {
  try {
    let choose = 0;
    while (choose !== 5) {
      console.log(`----- Product Menu -----`);
      console.log("1. Get Product");
      console.log("2. Add a product");
      console.log("3. Update product information");
      console.log("4. Delete a product");
      console.log("5. Exit the product menu");
      choose = readlineSync.questionInt("Choose an option: ");

      switch (choose) {
        case 1:
          await getProduct();
          break;
        case 2:
          const name = readlineSync.question("Enter product name: ");
          const description = readlineSync.question(
            "Enter product description: "
          );
          const price = readlineSync.questionFloat("Enter product price: ");
          const stock = readlineSync.questionInt("Enter product stock: ");
          const category = readlineSync.question("Enter product category: ");
          const barcode = readlineSync.question("Enter product barcode: ");
          const status = readlineSync.question("Enter product status: ");
          await addProduct(
            name,
            description,
            price,
            stock,
            category,
            barcode,
            status
          );
          break;
        case 3:
          const id = readlineSync.questionInt("Enter product ID: ");
          const newName = readlineSync.question("Enter the new product name: ");
          const newDescription = readlineSync.question(
            "Enter the new product description: "
          );
          const newPrice = readlineSync.questionFloat(
            "Enter the new product price: "
          );
          const newStock = readlineSync.questionInt(
            "Enter the new product stock: "
          );
          const newCategory = readlineSync.question(
            "Enter the new product category: "
          );
          const newBarcode = readlineSync.question(
            "Enter the new product barcode: "
          );
          const newStatus = readlineSync.question(
            "Enter the new product status: "
          );
          await updateProduct(
            id,
            newName,
            newDescription,
            newPrice,
            newStock,
            newCategory,
            newBarcode,
            newStatus
          );
          break;
        case 4:
          const iD = readlineSync.questionInt("Enter product ID: ");
          await deleteProduct(iD);
          break;
        case 5:
          console.log("Exiting the product menu...");
          break;
        default:
          console.log("\nYou did not choose a valid option\n");
          break;
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}

async function purcharseOrder() {
  try {
    let choose = 0;
    while (choose !== 5) {
      console.log(`----- Order Menu -----`);
      console.log("1. Get purcharse order");
      console.log("2. Add a purcharse order");
      console.log("3. Update purcharse order information");
      console.log("4. Delete a purcharse order");
      console.log("5. Exit the order menu");
      choose = readlineSync.questionInt("Choose an option: ");

      switch (choose) {
        case 1:
          await getOrder();
          break;
        case 2:
          // Retrieve basic information about the order
          const date = readlineSync.question("Enter order date (YYYY-MM-DD): ");
          const delivery_address = readlineSync.question(
            "Enter order delivery address: "
          );
          const track_number = readlineSync.question(
            "Enter order track number: "
          );
          const status = readlineSync.question("Enter order status: ");
          const customer_id = readlineSync.questionInt("Enter customer ID: ");

          // Initialization of order details
          const orderDetails = [];

          // Submenu for adding products to the order
          let addMoreDetails = true;
          while (addMoreDetails) {
            console.log("\n----- Add Product to Order -----");
            console.log("1. Add Product");
            console.log("2. Save Order");
            console.log("3. Exit");

            const subChoice = readlineSync.questionInt("Choose an option: ");

            switch (subChoice) {
              case 1:
                // Add a product
                const productId =
                  readlineSync.questionInt("Enter product ID: ");
                const quantity = readlineSync.questionInt("Enter quantity: ");
                const price = readlineSync.questionFloat("Enter price: ");
                orderDetails.push({ productId, quantity, price });
                console.table("Product added to order.");
                break;
              case 2:
                // Save a order
                await addOrder(
                  date,
                  delivery_address,
                  track_number,
                  status,
                  orderDetails
                );
                console.table("Order saved successfully.");
                addMoreDetails = false; // Exit the submenu
                break;
              case 3:
                // Exit without saving
                console.log("Exiting without saving the order.");
                addMoreDetails = false; // Exit the submenu
                break;
              default:
                console.log("Invalid option. Please choose again.");
                break;
            }
          }
          break;
        case 3:
          // Update order
          const orderIdToUpdate = readlineSync.questionInt("Enter order ID: ");
          const newDate = readlineSync.question(
            "Enter new order date (YYYY-MM-DD): "
          );
          const newDeliveryAddress = readlineSync.question(
            "Enter new delivery address: "
          );
          const newTrackNumber = readlineSync.question(
            "Enter new track number: "
          );
          const newStatus = readlineSync.question("Enter new status: ");
          const newCustomerId = readlineSync.question(
            "Enter new customer ID: "
          );

          await updateOrder(
            orderIdToUpdate,
            newDate,
            newDeliveryAddress,
            newTrackNumber,
            newStatus,
            newCustomerId,
            orderDetails
          );
          console.log("Order updated successfully.");
          break;
        case 4:
          // Delete the order
          const orderIdToDelete = readlineSync.question(
            "Enter order ID to delete: "
          );
          await deleteOrder(orderIdToDelete);
          console.log("Order deleted successfully.");
          break;
        case 5:
          console.log("Exiting the order menu...");
          break;
        default:
          console.log("You did not choose a valid option.");
          break;
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}

async function payment() {
  try {
    let choose = 0;
    while (choose !== 5) {
      console.log(`----- Payment Menu -----`);
      console.log("1. Get a payment");
      console.log("2. Add a payment");
      console.log("3. Update payment information");
      console.log("4. Delete a payment");
      console.log("5. Exit the payment menu");
      choose = readlineSync.questionInt("Choose an option: ");

      switch (choose) {
        case 1:
          await getPayment();
          break;
        case 2:
          const date = readlineSync.question("Enter payment date: ");
          const amount = readlineSync.question("Enter payment amount: ");
          const paymentMethod = readlineSync.question("Enter payment method: ");
          const orderId = readlineSync.questionInt("Enter order id: ");
          await addPayment(date, amount, paymentMethod, orderId);
          break;
        case 3:
          const id = readlineSync.questionInt("Enter payment id: ");
          const newdate = readlineSync.question("Enter payment new date: ");
          const newamount = readlineSync.question("Enter payment new amount: ");
          const newpaymentMethod = readlineSync.question(
            "Enter payment  method: "
          );
          const neworderId = readlineSync.question("Enter order id: ");
          await updatePayment(
            id,
            newdate,
            newamount,
            newpaymentMethod,
            neworderId
          );
          break;
        case 4:
          const iD = readlineSync.questionInt("Enter customer ID: ");
          await deletePayment(iD);
          break;
        case 5:
          console.log("\nExiting the payment menu...\n");
          break;
        default:
          console.log("\nYou did not choose a valid option\n");
          break;
      }
    }
  } catch (e) {
    throw e.message;
  }
}

module.exports = { customer, product, purcharseOrder, payment };
