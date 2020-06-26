# Bamazon (Command line store application)

Bamazon is a command-line Node.js application that mimics a shopping site. It allows users to purchase items, view inventories and several other features. There are two applications: one for customers and one for users

# Application Organization

1. Make sure to have MySQL Workbench installed on your machine, as well as Node.js

2. In MySQL Workbench, run the lines in the `schema.sql` file, as well as the `seeds10.sql`.

3. Using Terminal (Mac) or Gitbash (PC), navigate to the root folder of the cloned repository in which this repository's files are stored on your machine.

4. In Terminal/Gitbash, run `npm install` to install necessary node modules needed to run this application.

5. Next, you will have two choices of how to proceed in using this application: **Customer** or **Manager**.


# Customer (bamazonCustomer.js) User Instructions

1. Enter `node bamazonCustomer.js` in Terminal/Gitbash.

2. You will be shown all items in the inventory.

3. Enter the id of the item you would like to buy.

4. If there are enough articles of the product you wish to buy, your total price will be shown.

![gif animation of bamazonCustomer](./gifs/customer.gif)



# Manager (bamazonManager.js) User Instructions

1. Enter `node bamazonManager.js` in Terminal/Gitbash.

2. You will be shown four options of tasks in manager view. Using the arrow keys, enter the task you wish to perform.

* View products for sale
* View low inventory
* Add to inventory
* Add new product

3. 'View products for sale' allows you to see the full inventory.

4. 'View low inventory' shows you items that have fewer than 5 articles left in stock.

5. 'Add to inventory' allows you to add more articles of a particular item to the inventory. Enter the id of the 
item you are adding more of, then enter the quantity of this item that you are adding to the existing inventory. The new total will be updated in the MySQL database.

6. Finally, 'Add new product' allows you to enter a new item into the database. Enter all pertinent information. The price should be entered without a dollar sign or other currency symbols. After receiving confirmation in the command line that your product das been added, refresh the table in MySQL Workbench to see the updated product.

![gif animation of bamazonCustomer](./gifs/manager.gif)

# Technologies Used

* Node.js

* SQL

* MySQL Workbench

* MySQL (Node package)

* Inquirer (Node package)

* CLI Table (Node package)



# Credits

* Patrick Urbankowski