var mysql = require("mysql");
var inquirer = ("inquirer");
var Table = require("cli-table");
var chalk = ("chalk");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected as ID " + connection.threadId + "\n");
    runSearch();
});

function runSearch() {
    inquirer.prompt({
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
            "View Product Sales by Department",
            "Create a New Department",
            "Delete an Existing Department"
        ]
    }).then(function(answer) {
        switch(answer.action) {
            case "View Product Sales by Department": groupDepartment();
            break;
            case "Create a New Department": createNewDepartment();
            break;
            case "Delete an Existing Department": deleteDepartment();
            break;
        }
    });
}

var departmentName;
var productSales;

function groupDepartment(){
    var query = "SELECT department_name, SUM(product_sales) as product_sales FROM products GROUP BY department_name";
    connection.query(query, function(err, respondez){
        for (var i=0; i<respondez.length; i++) {
            departmentName = respondez[i].department_name;
            productSales = respondez[i].product_sales;
            updateDepartment();
        }
        generateProfitsShowAll();
    });
}

function updateDepartment() {
    console.log("Updating below: \n");
    var query = connection.query(
        "UPDATE departments SET ? WHERE ?",
        [{product_sales: productSales}, {department_name: departmentName}], function(err, respondez) {
            console.log(respondez.affectedRows + " products updated..!\n");
        }
    );
    console.log(query.sql);
}

function readProducts() {
    console.log("View Product Sales by Department: \n");
    connection.query("SELECT * FROM departments", function(err, respondez) {
        if (err) throw err;
        console.table(respondez);
        runSearch();
    });
}

function generateProfitsShowAll() {
    var query = "SELECT department_id, department_name, over_head_cost, product_sales, product_sales-over_head_cost as total_profit FROM departments";
    connection.query(query, function(err, respondez) {
        var table = new Table({
            head: ['department_id', 'department_name', 'product_sales', 'over_head_cost', 'total_profit'],
            colWidths: [16,18,16,16,16]
        });
        for (var i=0; i<respondez.length; i++) {
            table.push(
                [respondez[i].department_id, respondez[i].department_name, respondez[i].product_sales, respondez[i].over_head_cost, respondez[i].total_profit]
            );
        }
        console.log(table.toString());
        runSearch();
    });
}

function createNewDepartment() {
    var departmentName;
    var overheadCost;

    console.log("Creating a New Department below: ");
    inquirer.prompt([{
        name: "department",
        message: "Enter a New Department Name: "
    },{
        type: "input",
        name: "overheadcost",
        message: "Enter Overhead Cost for Department: ",
        validate: function(val) {
            return val > 0;}
    }]).then(function(answers) {
        departmentName = answers.department;
        overheadCost = parseInt(answers.overheadcost);

        console.log("Adding a New Product... \n");
        connection.query("INSERT INTO departments SET ?",
        {department_name: departmentName, over_head_cost: overheadCost, product_sales: 0}, function(err, respondez) {
            console.log(respondez.affectedRows + " product inserted..! \n");
        }
        );
        console.affectedRows(query.sql);
        readProducts();
    });
}

function deleteDepartment() {
    var departmentIDdel;

    console.log("Which department would you like to delete? ");
    inquirer.prompt([{
        type: "input",
        name: "deptIDdel",
        message: "Enter Department ID: ",
        validate: function(val) {
            return val > 0;}
    }]).then(function(answers) {
        departmentIDdel = answers.deptIDdel;

        console.log("Deleting Selected Department below: \n");
        connection.query("DELETE FROM departments WHERE ?", {department_id: departmentIDdel}, function(err, respondez) {
            console.log(respondez.affectedRows + " department deleted..!\n");
        });
        readProducts();
    });
}