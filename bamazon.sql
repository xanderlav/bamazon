CREATE DATABASE bamazon;

USE bamazon;

// Define products table
CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

// Insert data into products table
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ('Hammer', 'Hardware', 7.75, 500),
		('Screwdriver', 'Hardware', 5.50, 627),
		('Hand Lamp', 'Hardware', 2.25, 250),
		('Häagen-Dazs Ice Cream', 'Grocery', 4.15, 85),
		('Tin-Larin Chocolate', 'Grocery', 1.50, 125),
		('Trash Bags', 'Grocery', 4.95, 400),
		('Paper Towels', 'Grocery', 3.15, 150),
		('Apple Juice', 'Grocery', 2.45, 270),
		('Coconut Water', 'Grocery', 3.80, 350),
		('EcoFriendly Toiler Paper', 'Grocery', 10.50, 360),
		('Mountain Bike', 'Sports', 150.50, 100),
		('Polo Shirt', 'Clothing', 8.55, 130),
		('UnderArmour Shorts', 'Clothing', 16.45, 380),
		('Aspirine', 'Pharmacy', 2.45, 280),
		('Kids Bandage', 'Pharmacy', 2.45, 250);