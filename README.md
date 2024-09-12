# ABC Corporation

## Description

Cette application console Node.js permet de gérer les opérations CRUD (Create, Read, Update, Delete) pour les entités de l'entreprise ABC Corporation.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (version 12 ou supérieure)
- Une base de données MySQL doit être en cours d'exécution.
- Installez les dependances nécessaires comme [MYSQL2] et [readlineSyunc].

## Installation

Suivez ces étapes pour configurer le projet sur votre machine locale :

1. **Clonez le repository :**

   ```bash
   git clone https://github.com/mariem2012/Update-ABC-Corporation.git
   ```

2. **Accédez au dossier du projet :**

   ```bash
   cd Update-ABC-Corporation
   ```

3. **Installez les dépendances :**

   ```bash
   npm install
   ```

## Utilisation

Pour démarrer l'application, exécutez la commande suivante :

```bash
node index.js
```

## Les fonctionalités

1. **Customers :**

- getCustomer : cette fonction permet de lister les clients.

- addCustomer : cette fonction permet d'ajouter un client.

- deleteCustomer : cette fonction permet d'effacer un client à partir de son id.

- updateCustomer : cette fonction permet de modifier un client.

2. **Products :**

- getProduct : cette fonction permet de lister les produits.

- addProduct : cette fonction permet d'ajouter un produit.

- updateProduct : cette fonction permet de modifier un produit.

- deleteProduct : cette fonction permet d'effacer un produit à partir de son id.

3. **Purchase_orders :**

- getOrder : cette fonction permet de lister les commandes avec leurs details.

- addOrder : cette fonction permet d'ajouter une commande avec ses details.

- updateOrder : cette fonction permet de modifier une commande.

- deleteOrder : cette fonction permet d'effacer une commande avec ses details à partir de son id.

4. **Payments :**

- getPayment : cette fonction permet de lister les payments.

- addPayment : cette fonction permet d'ajouter un payment.

- updatePayment : cette fonction permet de modifier un payment.

- deletePayment : cette fonction permet d'effacer un payment à partir de son id.

## Authors

- [Mariem Boudallaye Dianifaba](https://github.com/mariem2012)
