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

        inquirer.prompt([
            {
                name: "id",
                type: "number",
                message: "What is the id of the product you would like to buy?"
            },
            {
                name: "quantity",
                type: "number",
                message: "How many units would you like to purchase?"
            }
        ])
        .then(function(answer){
            var productID = answer.id;
            var quantity = answer.quantity;

            connection.query("SELECT * FROM products WHERE id=" + productID, function(err, item){
                if (err) throw err;

                if (item[0].stock_quantity - quantity >= 0) {
                    console.log("Quantity in stock: " + item[0].stock_quantity + ". Quantity requested: " + quantity);
                    console.log("Sufficient amount in stock. Your order for the " + item[0].product_name + " can be fulfilled.");
                    console.log("Your total is: $" + (answer.quantity * item[0].price) + ".");
                    
                    connection.query("UPDATE products SET stock_quantity=? WHERE id=?", 
                    [item[0].stock_quantity - quantity, productID],
                    function(err){
                        if (err) throw err;
                        console.log("This is run");
                        bamazonCustomer();
                    }
                    );
            
                }

                else {
                    console.log("Insufficient quantity! Bamazon has only " + item[0].quantity + item[0].product_name + " in stock. Please try again.");
                    console.log("else is run");
                    bamazonCustomer();
                }
            });
        });


    });
}