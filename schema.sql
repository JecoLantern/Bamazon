DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(45) NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "Games and Consoles", 299.99, 100),
	("Nintendo 3DS", "Games and Consoles", 199.99, 200),
    ("Let's GO Pikachu and Eevee Bundle", "Games and Consoles", 99.99, 100),
    ("iPad Pro X 256GB", "Electronics", 1099, 150),
    ("One Pallet of Spam", "Food, Drinks and Consumables", 89.99, 300),
    ("A Complete Set of Harry Potter Movies", "Films", 129.99, 80),
    ("Ray Band Shades", "Apparel", 69.99, 90),
    ("Gucci Handbag", "Apparel", 1499, 5),
    ("Zombie Response Kit", "Necessities", 249.99, 3),
    ("Millenial Monopoly", "Board Games", 85, 40);

CREATE TABLE departments(
    department_id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    overhead_costs DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, overhead_costs)
VALUES ("Games and Consoles", 1000),
	("Electronics", 5000),
    ("Food, Drinks and Consumables", 2000),
    ("Apparel", 1500),
    ("Necessities", 900),
    ("Board Games", 500);