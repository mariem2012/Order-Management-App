const readlineSync = require("readline-sync");

const {
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  customerIdExists,
  phoneExists,
  emailExists,
} = require("./customerManager.js");

const {
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  productIdExists,
  barcodeExists,
} = require("./productManager.js");

const {
  getOrder,
  addOrder,
  updateOrder,
  deleteOrder,
  orderIdExists,
  trackNumberExists,
} = require("./orderManager.js");

const {
  getPayment,
  addPayment,
  updatePayment,
  deletePayment,
  paymentIdExists,
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
          let name = readlineSync.question("Enter customer name: ");
          while (name === "") {
            console.log(
              "Customer name is required. Please enter a valid name."
            );
            name = readlineSync.question("Enter customer name: ");
          }

          let address = readlineSync.question("Enter customer address: ");
          while (address === "") {
            console.log(
              "Customer address is required. Please enter a valid address(string)."
            );
            address = readlineSync.question("Enter customer address: ");
          }

          let email = readlineSync.questionEMail("Enter customer email: ");
          while (await emailExists(email)) {
            console.log(
              `The email ${email} is already in use. Please use another email.`
            );
            email = readlineSync.questionEMail("Enter a different email: ");
          }

          let phone = readlineSync.question("Enter customer phone: ");
          while (phone === "") {
            console.log(
              "Customer phone is required. Please enter a valid phone number."
            );
            phone = readlineSync.question("Enter customer phone: ");
          }

          while (await phoneExists(phone)) {
            console.log(
              `The phone number ${phone} is already in use. Please use another phone number.`
            );
            phone = readlineSync.question("Enter a different phone number: ");
          }
          await addCustomer(name, address, email, phone);
          break;
        case 3:
          let customerIdToUpdate;
          while (true) {
            customerIdToUpdate = readlineSync.questionInt(
              "Enter new customer ID : "
            );

            if (await customerIdExists(customerIdToUpdate)) {
              break;
            } else {
              console.log(
                `Customer ID : ${customerIdToUpdate} doesn't exist. Please try another ID`
              );
            }
          }

          let newName = readlineSync.question("Enter customer new name: ");
          while (newName === "") {
            console.log(
              "Customer new name is required. Please enter a valid name."
            );
            newName = readlineSync.question("Enter customer name: ");
          }

          let newAddress = readlineSync.question("Enter customer address: ");
          while (newAddress === "") {
            console.log(
              "Customer new address is required. Please enter a valid address."
            );
            newAddress = readlineSync.question("Enter customer new address: ");
          }

          let newEmail = readlineSync.questionEMail("Enter the new email: ");
          while (await emailExists(newEmail, customerIdToUpdate)) {
            console.log(
              `The email ${newEmail} is already in use by another customer. Please use a different email.`
            );
            newEmail = readlineSync.questionEMail("Enter a different email: ");
          }

          let newPhone = readlineSync.question("Enter customer phone: ");
          while (newPhone === "") {
            console.log(
              "Customer phone is required. Please enter a valid phone number."
            );
            newPhone = readlineSync.question("Enter customer phone: ");
          }

          while (await phoneExists(newPhone)) {
            console.log(
              `The phone number ${newPhone} is already in use. Please use another phone number.`
            );
            newPhone = readlineSync.question(
              "Enter a different phone number: "
            );
          }
          await updateCustomer(
            customerIdToUpdate,
            newName,
            newAddress,
            newEmail,
            newPhone
          );
          break;
        case 4:
          let customerIdToDelete;
          while (true) {
            customerIdToDelete = readlineSync.questionInt(
              "Enter delete customer ID : "
            );

            if (await customerIdExists(customerIdToDelete)) {
              break;
            } else {
              console.log(
                `Customer ID : ${customerIdToDelete} doesn't exist. Please try another ID`
              );
            }
          }
          await deleteCustomer(customerIdToDelete);
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
          let name = readlineSync.question("Enter product name: ");
          while (name === "") {
            console.log("Product name is required. Please enter a valid name.");
            name = readlineSync.question("Enter product name: ");
          }

          let description = readlineSync.question(
            "Enter product description: "
          );
          while (description === "") {
            console.log(
              "Product description is required. Please enter a valid description."
            );
            description = readlineSync.question("Enter product description: ");
          }

          let price = readlineSync.questionFloat("Enter product price: ");
          while (isNaN(price)) {
            console.log("Product price is required and should be a number.");
            price = readlineSync.questionFloat("Enter product price: ");
          }

          let stock = readlineSync.questionInt("Enter product stock: ");
          while (isNaN(stock)) {
            console.log("Product stock is required and should be an integer.");
            stock = readlineSync.questionInt("Enter product stock: ");
          }

          let category = readlineSync.question("Enter product category: ");
          while (category === "") {
            console.log(
              "Product category is required. Please enter a valid category."
            );
            category = readlineSync.question("Enter product category: ");
          }

          let barcode;
          while (true) {
            barcode = readlineSync.question("Enter product barcode: ");
            if (barcode === "") {
              console.log(
                "Product barcode is required. Please enter a valid barcode."
              );
            } else if (await barcodeExists(barcode)) {
              console.log(
                `The barcode ${barcode} is already in use. Please use another barcode.`
              );
            } else {
              break;
            }
          }

          let status = readlineSync.question("Enter product status: ");
          while (status === "") {
            console.log(
              "Product status is required. Please enter a valid status."
            );
            status = readlineSync.question("Enter product status: ");
          }
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
          let productIdToUpdate;
          while (true) {
            productIdToUpdate = readlineSync.questionInt(
              "Enter new product ID  : "
            );

            if (await productIdExists(productIdToUpdate)) {
              break;
            } else {
              console.log(
                `Product  ID : ${productIdToUpdate} doesn't exist. Please try another ID`
              );
            }
          }

          let newName = readlineSync.question("Enter product name: ");
          while (newName === "") {
            console.log(
              "Product new name is required. Please enter a valid name."
            );
            newName = readlineSync.question("Enter product name: ");
          }

          let newDescription = readlineSync.question(
            "Enter new product description: "
          );
          while (newDescription === "") {
            console.log(
              "Product description is required. Please enter a valid description."
            );
            newDescription = readlineSync.question(
              "Enter product description: "
            );
          }

          let newPrice = readlineSync.questionFloat(
            "Enter new product price: "
          );
          while (isNaN(newPrice)) {
            console.log("Product price is required and should be a number.");
            newPrice = readlineSync.questionFloat("Enter product price: ");
          }

          let newStock = readlineSync.questionInt("Enter new product stock: ");
          while (isNaN(newStock)) {
            console.log("Product stock is required and should be an integer.");
            newStock = readlineSync.questionInt("Enter product stock: ");
          }

          let newCategory = readlineSync.question(
            "Enter new product category: "
          );
          while (newCategory === "") {
            console.log(
              "Product category is required. Please enter a valid category."
            );
            newCategory = readlineSync.question("Enter product category: ");
          }

          let newBarcode;
          while (true) {
            newBarcode = readlineSync.question(
              "Enter the new product barcode: "
            );
            if (newBarcode === "") {
              console.log("Product barcode is required.");
            } else if (await barcodeExists(newBarcode, productIdToUpdate)) {
              console.log(
                `The barcode ${newBarcode} is already in use. Please use another barcode.`
              );
            } else {
              break;
            }
          }

          let newStatus = readlineSync.question("Enter product status: ");
          while (newStatus === "") {
            console.log(
              "Product status is required. Please enter a valid status."
            );
            newStatus = readlineSync.question("Enter product status: ");
          }
          await updateProduct(
            productIdToUpdate,
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
          let productIdToDelete;
          while (true) {
            productIdToDelete = readlineSync.questionInt(
              "Enter new product ID  : "
            );

            if (await productIdExists(productIdToDelete)) {
              break;
            } else {
              console.log(
                `Product  ID : ${productIdToDelete} doesn't exist. Please try another ID`
              );
            }
          }
          await deleteProduct(productIdToDelete);
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
          const iD = readlineSync.questionInt("Enter order id: ");
          await getOrder(iD);
          break;
        case 2:
          let date = readlineSync.question("Enter order date (YYYY-MM-DD): ");
          while (date === "") {
            console.log("Order date is required. Please enter a valid date.");
            date = readlineSync.question("Enter order date: ");
          }

          let delivery_address = readlineSync.question(
            "Enter delivery address: "
          );
          while (delivery_address === "") {
            console.log(
              "Order delivery address is required. Please enter a valid delivery address."
            );
            delivery_address = readlineSync.question(
              "Enter delivery address: "
            );
          }

          let track_number;
          while (true) {
            track_number = readlineSync.question(
              "Enter the new product barcode: "
            );
            if (track_number === "") {
              console.log(
                "The track number is required. Please enter a valid tracking number.."
              );
            } else if (await trackNumberExists(track_number)) {
              console.log(
                `The track number ${track_number} is already in use. Please use another track number.`
              );
            } else {
              break;
            }
          }

          let status = readlineSync.question("Enter status: ");
          while (status === "") {
            console.log(
              "Order status is required. Please enter a valid status."
            );
            status = readlineSync.question("Enter status: ");
          }

          let customerId;
          while (true) {
            customerId = readlineSync.questionInt("Enter customer ID : ");

            if (await customerIdExists(customerId)) {
              break;
            } else {
              console.log(
                `Customer ID : ${customerId} doesn't exist. Please try another ID`
              );
            }
          }

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
                let productId;
                while (true) {
                  productId = readlineSync.questionInt(
                    "Enter the new product ID  : "
                  );

                  if (await productIdExists(productId)) {
                    break;
                  } else {
                    console.log(
                      `Product  ID : ${productId} doesn't exist. Please try another ID`
                    );
                  }
                }
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
                  customerId,
                  orderDetails
                );
                console.table("Order saved successfully.");
                addMoreDetails = false;
                break;
              case 3:
                // Exit without saving
                console.log("Exiting without saving the order.");
                addMoreDetails = false;
                break;
              default:
                console.log("Invalid option. Please choose again.");
                break;
            }
          }
          break;
        case 3:
          // Update order
          let orderIdToUpdate;
          while (true) {
            orderIdToUpdate = readlineSync.questionInt("Enter new order ID : ");

            if (await orderIdExists(orderIdToUpdate)) {
              break;
            } else {
              console.log(
                `Order ID : ${orderIdToUpdate} doesn't exist. Please try another ID`
              );
            }
          }

          let newDate = readlineSync.question(
            "Enter new order date (YYYY-MM-DD): "
          );
          while (newDate === "") {
            console.log("Order date is required. Please enter a valid date.");
            newDate = readlineSync.question(
              "Enter new order date (YYYY-MM-DD): "
            );
          }

          let newDeliveryAddress = readlineSync.question(
            "Enter new delivery address: "
          );
          while (newDeliveryAddress === "") {
            console.log(
              "Order delivery address is required. Please enter a valid delivery address."
            );
            newDeliveryAddress = readlineSync.question(
              "Enter new delivery address: "
            );
          }

          let newTrackNumber;
          while (true) {
            newTrackNumber = readlineSync.question(
              "Enter the new product track number: "
            );
            if (newTrackNumber === "") {
              console.log(
                "The track number is required. Please enter a valid tracking number.."
              );
            } else if (await barcodeExists(newTrackNumber, orderIdToUpdate)) {
              console.log(
                `The track number ${newTrackNumber} is already in use. Please use another track number.`
              );
            } else {
              break;
            }
          }

          let newStatus = readlineSync.question("Enter new status: ");
          while (newStatus === "") {
            console.log(
              "Order status is required. Please enter a valid status."
            );
            newStatus = readlineSync.question("Enter new status: ");
          }

          let customerIdToUpdate;
          while (true) {
            customerIdToUpdate = readlineSync.questionInt(
              "Enter  new customer ID : "
            );

            if (await customerIdExists(customerIdToUpdate)) {
              break;
            } else {
              console.log(
                `Customer ID : ${customerIdToUpdate} doesn't exist. Please try another ID`
              );
            }
          }

          // Initialize orderDetails for the update
          const orderDetailsUpdate = [];

          // Submenu for adding products to the updated order
          let addMoreDetailsUpdate = true;
          while (addMoreDetailsUpdate) {
            console.log("\n----- Add Product to Updated Order -----\n");
            console.log("1. Add Product");
            console.log("2. Save Updated Order");
            console.log("\n3. Exit\n");

            const subChoiceUpdate =
              readlineSync.questionInt("Choose an option: ");

            switch (subChoiceUpdate) {
              case 1:
                let productIdToUpdate;
                while (true) {
                  productIdToUpdate = readlineSync.questionInt(
                    "Enter new product ID  : "
                  );

                  if (await productIdExists(productIdToUpdate)) {
                    break;
                  } else {
                    console.log(
                      `Product  ID : ${productIdToUpdate} doesn't exist. Please try another ID`
                    );
                  }
                }
                const quantityUpdate =
                  readlineSync.questionInt("Enter quantity: ");
                const priceUpdate = readlineSync.questionFloat("Enter price: ");
                orderDetailsUpdate.push({
                  productId: productIdToUpdate,
                  quantity: quantityUpdate,
                  price: priceUpdate,
                });
                console.table("Product added to updated order.");
                break;
              case 2:
                // Save the updated order
                await updateOrder(
                  orderIdToUpdate,
                  newDate,
                  newDeliveryAddress,
                  newTrackNumber,
                  newStatus,
                  customerIdToUpdate,
                  orderDetailsUpdate
                );
                console.table("Order updated successfully.");
                addMoreDetailsUpdate = false; // Exit the submenu
                break;
              case 3:
                // Exit without saving
                console.log("Exiting without saving the updated order.");
                addMoreDetailsUpdate = false; // Exit the submenu
                break;
              default:
                console.log("Invalid option. Please choose again.");
                break;
            }
          }
          break;
        case 4:
          // Delete the order
          let orderIdToDelete;
          while (true) {
            orderIdToDelete = readlineSync.questionInt(
              "Enter delete order ID : "
            );

            if (await orderIdExists(orderIdToDelete)) {
              break;
            } else {
              console.log(
                `Order ID : ${orderIdToDelete} doesn't exist. Please try another ID`
              );
            }
          }
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
          let date = readlineSync.question("Enter payment date: ");
          while (date === "") {
            console.log("Payment date is required. Please enter a valid date.");
            date = readlineSync.question("Enter payment date: ");
          }

          const amount = readlineSync.questionFloat("Enter payment amount: ");

          let paymentMethod = readlineSync.question("Enter payment_method: ");
          while (paymentMethod === "") {
            console.log(
              "Payment payment_method is required. Please enter a valid payment _methode."
            );
            paymentMethod = readlineSync.question("Enter payment method: ");
          }

          let orderId;
          while (true) {
            orderId = readlineSync.questionInt("Enter order ID : ");

            if (await orderIdExists(orderId)) {
              break;
            } else {
              console.log(
                `Order ID : ${orderId} doesn't exist. Please try another ID`
              );
            }
          }
          await addPayment(date, amount, paymentMethod, orderId);
          break;
        case 3:
          let paymentIdToUpdate;
          while (true) {
            paymentIdToUpdate = readlineSync.questionInt(
              "Enter new payment ID : "
            );

            if (await paymentIdExists(paymentIdToUpdate)) {
              break;
            } else {
              console.log(
                `Payment ID : ${paymentIdToUpdate} doesn't exist. Please try another ID`
              );
            }
          }
          let newdate = readlineSync.question("Enter new payment date: ");
          while (newdate === "") {
            console.log("Payment date is required. Please enter a valid date.");
            newdate = readlineSync.question("Enter new payment date: ");
          }

          const newamount = readlineSync.questionFloat(
            "Enter payment new amount: "
          );

          let newpaymentMethod = readlineSync.question(
            "Enter new payment_method: "
          );
          while (newpaymentMethod === "") {
            console.log(
              "Payment n payment_method is required. Please enter a valid payment _methode."
            );
            newpaymentMethod = readlineSync.question(
              "Enter new payment method: "
            );
          }

          let neworderId;
          while (true) {
            neworderId = readlineSync.questionInt("Enter new order ID : ");

            if (await orderIdExists(neworderId)) {
              break;
            } else {
              console.log(
                `Order ID : ${neworderId} doesn't exist. Please try another ID`
              );
            }
          }
          await updatePayment(
            paymentIdToUpdate,
            newdate,
            newamount,
            newpaymentMethod,
            neworderId
          );
          break;
        case 4:
          let paymentIdToDelete;
          while (true) {
            paymentIdToDelete = readlineSync.questionInt(
              "Enter delete payment ID : "
            );

            if (await paymentIdExists(paymentIdToDelete)) {
              break;
            } else {
              console.log(
                `Payment ID : ${paymentIdToDelete} doesn't exist. Please try another ID`
              );
            }
          }
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
