var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to Bamazon Customer as id: " + connection.threadId);
    bamazonCustomer();
});

function bamazonCustomer() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        var inventoryTable = new Table({
            head: ["ID", "Item", "Department", "Price", "Quantity"],
            colWidths: [10, 50, 20, 10, 10],
        });

        for (var i=0; i<res.length; i++){
            inventoryTable.push([res[i].id, res[i].product_name, res[i].department_name, 
                parseFloat(res[i].price), res[i].stock_quantity]);
        }

        console.log(inventoryTable.toString());

    })
}