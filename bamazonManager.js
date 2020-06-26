//Require packages needed for node application to run
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

//Connect to MySQL (password needs to be changed according to your pw)
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

//if connection is successful, alert user
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Bamazon Manager as id: " + connection.threadId);
    bamazonManager();//run function that takes in user requests
});

function bamazonManager() {

    inquirer.prompt({
        name: "option",
        type: "list",
        message: "Choose an option: ",
        choice: [
            "View products for sale",
            "View low inventory",
            "Add to inventory",
            "Add new product"
        ]
    })
        .then(function (answer) {
            switch (answer.option) {

                case "View products for sale":
                    viewProducts();
                    break;

                case "View low inventory":
                    viewLow();
                    break;

                case "Add to inventory":
                    addInventory();
                    break;

                case "Add new product":
                    addProduct();
                    break;
            }
        });
}

function viewProducts() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        //using cli-table, format table to show data
        var inventoryTable = new Table({
            head: ["ID", "Item", "Department", "Price", "Quantity"],
            colWidths: [10, 50, 20, 10, 10],
        });

        //cycle through all items to list them in table
        for (var i = 0; i < res.length; i++) {
            inventoryTable.push([res[i].id, res[i].product_name, res[i].department_name,
            parseFloat(res[i].price), res[i].stock_quantity]);
        }

        //display data in node application in terminal/gitbash
        console.log(inventoryTable.toString());

    });

    bamazonManager();
}

function viewLow() {
    //collect only items in the inventory that have fewer than 5 articles in stock
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        //using cli-table, format table to show data
        var inventoryTable = new Table({
            head: ["ID", "Item", "Department", "Price", "Quantity"],
            colWidths: [10, 50, 20, 10, 10],
        });

        //cycle through all items to list them in table
        for (var i = 0; i < res.length; i++) {
            inventoryTable.push([res[i].id, res[i].product_name, res[i].department_name,
            parseFloat(res[i].price), res[i].stock_quantity]);
        }

        //display data in node application in terminal/gitbash
        console.log(inventoryTable.toString());

    });

    bamazonManager();
}

function addInventory() {
    //collect all items from MySQL
    connection.query("SELECT * FROM products", function (err, results) {

        if (err) throw err;

        //prompt user to enter the id of the item and how many articles will be added to its inventory
        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "Enter the id of the product whose inventory you would like to increase: "
            },
            {
                name: "moreitems",
                type: "input",
                message: "How many items will be added?"
            }
        ])
            .then(function (answer) {
                //define a variable to be equal to the line in the database that matches the proper item
                var updateItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === answer.id) {
                        updateItem = results[i];
                    }
                }
                //the new quantity of the item will be its existing quantity (in MySQL) plus the input here
                var newQuantity = updateItem.stock_quantity + answer.moreitems;

                //update the products in MySQL according to quantity entered here
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        id: updateItem.id
                    }
                ],
                    function (err) {
                        if (err) throw err;
                    }
                );
                    console.log("Updated quantity of " + updateItem.product_name + " to " + newQuantity);
            })

    })

}

function addProduct() {

    //ask the user for all of the details of the item they would like to add
    inquirer.prompt([
        {
            name: "prodName",
            type: "input",
            message: "Enter the name of the product: "
        },
        {
            name: "deptName",
            type: "input",
            message: "Enter the department of the item: "
        },
        {
            name: "price",
            type: "input",
            message: "Price of the new product (without $ sign): "
        },
        {
            name: "quantity",
            type: "input",
            message: "How many of these do you have in stock?"
        }
    ])
    .then(function(answer) {

        //enter the product details to the database
        var query = connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)",[answer.prodName, answer.deptName, answer.price, answer.quantity],
        function(err, res) {
            if (err) throw err;
            //show the user the entered row
            console.log(res.affectedRows + " entered to database.");
        }
        ); 
        bamazonManager();
    })
}