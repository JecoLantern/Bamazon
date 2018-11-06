var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err)throw err;
    console.log("Connection as ID: " + connection.threadId + "\n");
    runSearch();
});

function runSearch() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory(=count lower than five)",
            "Add to Inventory",
            "Add New Product",
            "Delete A Product"
        ]
    }).then(function(answer) {
        switch (answer.action) {
            case "View Products for Sale": viewProducts();
            break;
            case "View Low Inventory(=count lower than five)": viewLowInventory();
            break;
            case "Add to Inventory": addInventory();
            break;
            case "Add New Product": addNewProduct();
            break;
            case "Delete A Product": deleteProduct();
        }
    });
}

function 