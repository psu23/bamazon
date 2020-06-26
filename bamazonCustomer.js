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
connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to Bamazon Customer as id: " + connection.threadId);
    bamazonCustomer();//run function that takes in user requests
});


function bamazonCustomer() {
    //first, take all data from products table in MySQL
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        //using cli-table, format table to show data
        var inventoryTable = new Table({
            head: ["ID", "Item", "Department", "Price", "Quantity"],
            colWidths: [10, 50, 20, 10, 10],
        });

        //cycle through all items to list them in table
        for (var i=0; i<res.length; i++){
            inventoryTable.push([res[i].id, res[i].product_name, res[i].department_name, 
                parseFloat(res[i].price), res[i].stock_quantity]);
        }

        //display data in node application in terminal/gitbash
        console.log(inventoryTable.toString());

        //ask user for id of product they wish to purchase and quantity
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
            
            //based on id number of item, take the information about that product stored in MySQL
            connection.query("SELECT * FROM products WHERE id=" + productID, function(err, item){
                if (err) throw err;
            
                //if the quantity of that item store in MySQL minus the quantity requested is greater than zero, order can be fulfilled
                if (item[0].stock_quantity - quantity >= 0) {
                    console.log("Quantity in stock: " + item[0].stock_quantity + ". Quantity requested: " + quantity);
                    console.log("Sufficient amount in stock. Your order for the " + item[0].product_name + " can be fulfilled.");
                    console.log("Your total is: $" + (answer.quantity * item[0].price) + ".");
                    
                    //update products in MySQL after order is fulfilled
                    connection.query("UPDATE products SET stock_quantity=? WHERE id=?", 
                    [item[0].stock_quantity - quantity, productID],
                    function(err){
                        if (err) throw err;

                        //run application again for further purchases
                        bamazonCustomer();
                    }
                    );
            
                }

                else {
                    //if there are not enough in stock, alert the user and restart the application
                    console.log("Insufficient quantity! Bamazon has only " + item[0].quantity + item[0].product_name + " in stock. Please try again.");
                    bamazonCustomer();
                }
            });
        });


    });
}