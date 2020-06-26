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

    connection.query("SELECT * FROM products", function (err, results) {

        if (err) throw err;

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
                var updateItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === answer.id) {
                        updateItem = results[i];
                    }
                }
                var newQuantity = updateItem.stock_quantity + answer.moreitems;

                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: newQuantity
                    },
                    {
                        product_name: updateItem.product_name
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