// Declaring global variables
var inquirer = require("inquirer");
var mysql = require("mysql");

// Defining DB configuration
var connection = mysql.createConnection({
    host:'localhost',
    port: '3306',
    user: "root",
    password: "Xanderlav",
    database: "bamazon"
});


