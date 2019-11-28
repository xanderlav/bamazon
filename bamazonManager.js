// Declare global vars & packages required
var inquirer = require("inquirer");
var mysql = require("mysql");

// Defining MySQL DB configuration
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Xanderlav9731',
    database: 'bamazon'
});

// ManagerSelection will present menu options to the manager and trigger appropriate logic
function ManagerSelection() {
	// Prompt to select an option
    inquirer
    .prompt([
		{
			type: 'list',
			name: 'option',
			message: 'Please chose an option:',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
			filter: function (val) {
				if (val === 'View Products for Sale') {
					return 'sale';
				} else if (val === 'View Low Inventory') {
					return 'lowInventory';
				} else if (val === 'Add to Inventory') {
					return 'addInventory';
				} else if (val === 'Add New Product') {
					return 'newProduct';
				} else {
					// This case should be unreachable
					console.log('ERROR: Unsupported operation!');
					exit(1);
				}
			}
		}
	]).then(function(input) {
		// Executes the action based on the user input
		if (input.option ==='sale') {
			displayInventory();
		} else if (input.option === 'lowInventory') {
			displayLowInventory();
		} else if (input.option === 'addInventory') {
			addInventory();
		} else if (input.option === 'newProduct') {
			addNewProduct();
		} else {
			// This case should not happen 
			console.log('ERROR: Unsupported operation!');
			exit(1);
		}
	})
}

// displayInventory retrieves the current inventory from database and show it to user
function displayInventory() {
	// Define the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;
		console.log(`Current Inventory: `);
		console.log(` *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  |  ';
			strOut += 'Product Name: ' + data[i].product_name + '  |  ';
			strOut += 'Department: ' + data[i].department_name + '  |  ';
			strOut += 'Price: $' + data[i].price + '  |  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';
			console.log(strOut);
		}
	  	console.log(` *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);
		// End the database connection
		connection.end();
	})
}

// displayLowInventory will display a list of products with the available quantity below 100
function displayLowInventory() {
	// Construct the db query string
	queryStr = 'SELECT * FROM products WHERE stock_quantity < 100';
	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;
		console.log(`Low Inventory Items < 100 units: `);
		console.log(` *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);
		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item #: ' + data[i].item_id + '  |  ';
			strOut += 'Product Name: ' + data[i].product_name + '  |  ';
			strOut += 'Department: ' + data[i].department_name + '  |  ';
			strOut += 'Price: $' + data[i].price + '  |  ';
			strOut += 'Quantity: ' + data[i].stock_quantity + '\n';
			console.log(strOut);
		}
	  	console.log(` *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);
		// End the database connection
		connection.end();
	})
}

// Secure that the user is tipying only positive numbers for their inputs
function validateNumber(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);
	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a valid number (Greater than zero).';
	}
}

// validateNumeric makes sure that the user is supplying only positive numbers for their inputs
function validateNumeric(value) {
	// Value must be a positive number
	var number = (typeof parseFloat(value)) === 'number';
	var positive = parseFloat(value) > 0;

	if (number && positive) {
		return true;
	} else {
		return 'Please enter a positive number for the unit price.'
	}
}

// addInventory will guilde a user in adding additional quantify to an existing item
function addInventory() {
	// console.log('___ENTER addInventory___');

	// Prompt the user to select an item
	inquirer.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID for stock_count update.',
			validate: validateNumber,
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to add?',
			validate: validateNumber,
			filter: Number
		}
	]).then(function(input) {

		var item = input.item_id;
		var addQuantity = input.quantity;

		// Query db to confirm that the given item ID exists and to determine the current stock_count
		var queryStr = 'SELECT * FROM products WHERE ?';
		connection.query(queryStr, {item_id: item}, function(err, data) {
			if (err) throw err;
			if (data.length === 0) {
				console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
				addInventory();
			} else {
				var productData = data[0];

				console.log('Upgrading the Inventory...');

				// Defining the query string
				var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity + addQuantity) + ' WHERE item_id = ' + item;

                // Update the inventory
				connection.query(updateQueryStr, function(err, data) {
					if (err) throw err;
					console.log('Stock for Item # ' + item + ' has been updated to ' + (productData.stock_quantity + addQuantity));
					console.log(`\n *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);
					// End the database connection
					connection.end();
				})
			}
		})
	})
}

// addNewProduct includes a new product to the inventory
function addNewProduct() {
	// Request the user to type in product information
    inquirer
    .prompt([
		{
			type: 'input',
			name: 'product_name',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'department_name',
			message: 'Which department does the new product will be sell',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the unit price?',
			validate: validateNumeric
		},
		{
			type: 'input',
			name: 'stock_quantity',
			message: 'How many items are in stock?',
			validate: validateNumber
		}
	]).then(function(input) {
		console.log('Including new product: \n    product_name = ' + input.product_name + '\n' +  
									   '    department_name = ' + input.department_name + '\n' +  
									   '    price = ' + input.price + '\n' +  
									   '    stock_quantity = ' + input.stock_quantity);

		// Create the insertion query string
		var queryStr = 'INSERT INTO products SET ?';

		// Add new product to the db
		connection.query(queryStr, input, function (error, results, fields) {
			if (error) throw error;
			console.log('New product has been added to the inventory Item # ' + results.insertId);
			console.log(`\n *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);
			// End the database connection
			connection.end();
		});
	})
}

// mngBamazon will execute the main application logic
function mngBamazon() {
	// Prompt manager for requests
	ManagerSelection();
}

// Executes the main program
mngBamazon();