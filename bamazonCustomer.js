var mysql = require("mysql");
var inquirer = require("inquirer");
var figlet = require("figlet");
var chalk = require("chalk");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

var itemID;
var orderQuantity;
var stockQuantity;
var currentCost;
var totalCost = 0;
var totalSale;

connection.connect(function(err) {
    if (err) {
        console.log("Connection Error: " + err.stack);
    }
    var bamazonFigletized = "BAMAZON          BAMAZON";
    figlet(bamazonFigletized, function(err, data) {
    if (err) {
        console.log("Something wrong...");
        console.dir(err);
        return;
    }
    console.log(chalk.hex("#329999")(data));
    console.log(chalk.hex("#71cc0a")("\t\tWELCOME to BAmazon!"));
    loadProducts();
    });
});

function loadProducts() {
    console.log(chalk.hex("#71cc0a")("*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*=.=*"+"\n\n\t\tList of all available products: \n"));
    connection.query("SELECT * FROM products", function(err, respondez){
        if (err) throw err;
        console.table(respondez);

        purchaseStart();
    });
}

function purchaseStart() {
    inquirer.prompt([{
        type: "input",
        name: "itemID",
        message: "Please pick the item ID of the product you are ordering",
        validate: function(val) {
            return !isNaN(val);}
        },{
        type: "input",
        name: "quantity",
        message: "How many of this item would you like?",
        validate: function(val) {
            return val > 0;}

    }]).then(function(answers) {
        itemID = answers.itemID;
        orderQuantity = parseInt(answers.quantity);
        orderProduct();
        totalSale = 0;
    });
}

function orderProduct() {
    connection.query("SELECT * FROM products WHERE item_id=?", [itemID], function(err, respondez) {
        stockQuantity = respondez[0].stock_quantity;
        totalSale = respondez[0].product_sales;
        price = respondez[0].price;

        updateProduct();
    });
}

function askCustomerForItem() {
    inquirer.prompt({
        type: "confirm",
        name: "confirm",
        message: "Would you like to add more products?",
        default: false
    }).then (function(answer) {
        if(answer.confirm) {
            purchaseStart();
        }else{
            console.log("Your total cost is: $", totalCost);
            var thankU4ShoppingFigletized = "Thanks For Shopping!!";
            figlet(thankU4ShoppingFigletized, function(err, data) {
            if (err) {
                console.log("Something wrong...");
                console.dir(err);
                return;
            }
            console.log(chalk.hex("#329999")(data));
            connection.end();
            })
        }
    });
}
        
function updateProduct() {
    console.log("Updating... : \n");
    if((stockQuantity-orderQuantity)>0) {
        var query = connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: stockQuantity-orderQuantity, product_sales: totalSale+=(price * orderQuantity)},{item_id: itemID}], function(err, respondez) {
            console.log(chalk.hex("#71cc0a")(respondez.affectedRows + " products updated..!\n"));
            calculateCost();
            askCustomerForItem();
        });
        // console.log(query.sql);
    }else{
        console.log(chalk.red("Insufficient Quantity..!!\n"));
        console.log("Your total cost is: $", totalCost +"\n");
        // connection.end();
        purchaseStart();
    }
}
        
function calculateCost() {
    currentCost = price * orderQuantity;
    totalCost+=currentCost;
    console.log("Your current cost is: $", currentCost);
    console.log("Your total cost is: $", totalCost);
    // console.log("The " + itemID + " product total sale now is: $" + totalSale)
}
