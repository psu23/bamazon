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
    console.log("Connected to Bamazon Manager as id: " + connection.threadId);
    bamazonManager();//run function that takes in user requests
});