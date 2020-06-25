var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "replace with your password",
    database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to Bamazon Customer as id: " + connection.threadId);
    bamazonCustomer();
});

function bamazonCustomer() {

}