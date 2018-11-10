var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var figlet = require("figlet");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err)throw err;
    console.log(chalk.green("*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*\n\t\t We are Connected as ID: " + connection.threadId + "\n*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*\n"));
    var bamazonFigletized = "BAMAZON Manager Suite";
    figlet(bamazonFigletized, function(err, data) {
    if (err) {
        console.log("Something wrong...");
        console.dir(err);
        return;
    }
    console.log(chalk.hex("#329999")(data));
    console.log(chalk.hex("#71cc0a")("\t\tWELCOME to BAmazon Manager Suite!\n\n" + "*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*\n\n"));
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
            "Delete A Product",
            "Sign Out"
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
            break;
            case "Sign Out": signOut();
            break;
        }
    });
}

function viewProducts() {
    console.log(chalk.hex("#71cc0a")("*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*"+"\n\n\t\tList of all available products: \n"));
    connection.query("SELECT * FROM products", function(err, respondez){
    if (err) throw err;
    console.table(respondez);
    runSearch();
    })
}

function viewLowInventory(){
    console.log(chalk.hex("#71cc0a")("*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*"+"\n\n\t\tList of all available products: \n"));
    var query = "SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?";
    connection.query(query, [0,5], function(err, respondez) {
        if (respondez.length === 0) {
            console.log(chalk.green("No products lower than 5 stock quantity..!"));
        }else {
            console.table(respondez);
        }
        runSearch();
    });
}

function addInventory() {
    var stockQuantity;
    var itemID;
    var addQuantity;
    addInventoryInquire();
}

function addInventoryInquire() {
    inquirer.prompt([{
        name: "itemID",
        message: "To ADD More inventory, Please enter the item ID: "
    },{
        name: "addQuantity",
        message: "How many of this would you like to add?"
    
    }]).then(function(answers){
        itemID = answers.itemID;
        addQuantity = parseInt(answers.addQuantity);
        logProduct();
    });
}

function logProduct() {
    connection.query("SELECT * FROM products WHERE item_id=?", [itemID], function(err, respondez){
        stockQuantity = respondez[0].stock_quantity;
        updateProduct();
    });
}

function updateProduct() {
    console.log("Updating... : \n");
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [{stock_quantity: stockQuantity + addQuantity},{item_id: itemID}], function(err, respondez) {
            console.log(respondez.affectedRows + " products updated..!\n")
        }
    );
    console.log(query.sql);
    viewProducts();
}

function addNewProduct(){
    var itemID;
    var name;
    var department;
    var price;
    var stock;
    console.log(chalk.green("Input the New Product Information below: "));

    inquirer.prompt([{
        name: "itemID",
        message: "Item ID: "
    },{
        name: "name",
        messsage: "Product Name: "
    },{
        name: "department",
        message: "Department: "
    },{
        name: "price",
        message: "Price: "
    },{
        name: "stock",
        message: "Stock Quantity: "
    }]).then(function(answers){
        itemID = answers.itemID;
        name = answers.name;
        department = answers.department;
        price = parseInt(answers.price);
        stock = parseInt(answers.stock);

        console.log(chalk.green("Adding a NEW Product...\n"));
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                item_id: itemID,
                product_name: name,
                department_name: department,
                price: price,
                stock_quantity: stock
            }, function(err,respondez){
                console.log(respondez.affectedRows + " products inserted..!\n");
            }
        );
        console.log(query.sql);
        viewProducts();
    })
}

function deleteProduct(){
    var itemIDdel;

    console.log(chalk.green("Which product would you like to delete? "));
    inquirer.prompt([{
        name: "itemID",
        message: "Item ID: "
    }]).then(function(answers){
        itemIDdel = answers.itemID;

        console.log(chalk.red("Deleting product below: \n"));
        connection.query(
            "DELETE FROM products WHERE ?",
            {item_id: itemIDdel}, function(err, respondez){
                console.log(chalk.red(respondez.affectedRows + " products deleted..!\n"));
            }
        );
        viewProducts();
    });
}})

function signOut() {
    var seeYaSoonFigletized = "See you again soon!!";
    figlet(seeYaSoonFigletized, function(err, data) {
        if (err) {
            console.log("Something wrong...");
            console.dir(err);
            return;
        }
    console.log(chalk.hex("#329999")(data));
    connection.end()
})
}