// Declaring variables & dependencies
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

// Will prompt the user for the Item and Quantity to purchase
function promptUserPurchase() {
	// console.log(' <<< ENTER User Purchase >>> ');

	// Show options to user to shop an item
	inquirer
	.prompt([
		{
			type: 'input',
			name: 'item_id',
			message: 'Please enter the Item ID which you would like to purchase.',
			filter: Number
		},
		{
			type: 'input',
			name: 'quantity',
			message: 'How many do you need?',
			filter: Number
		}
	]).then(function(input) {

		var item = input.item_id;
		var quantity = input.quantity;

		// Query db to confirm that the given item ID exists in the desired quantity
		var qryStatmnt = 'SELECT * FROM products WHERE ?';

		connection.query(qryStatmnt, {item_id: item}, function(err, data) {
			if (err) throw err;
			// If get not results then show error message
			if (data.length === 0) {
				console.log('<<< ERROR: Item number does not exists! Please type in a valid Item number >>>');
				displayStock();
			} else {
				var resultData = data[0];

				// If the quantity requested by the user is in stock
				if (quantity <= resultData.stock_quantity) {
					console.log('Yey, the product you demand is in stock! Generating your order...|x| ');

					// Generating the updating query string
					var updateQryStatmnt = 'UPDATE products SET stock_quantity = ' + (resultData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
					// console.log('updateQryStatmnt = ' + updateQryStatmnt);

					// Update the inventory
					connection.query(updateQryStatmnt, function(err, data) {
						if (err) throw err;

						console.log('Your oder has been generated! Your total is $' + resultData.price * quantity);
						console.log('Thanks for buying with bamazon, you are very important for us! ;) ');
						console.log(`\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n`);

						// End the db connection
						connection.end();
					})
				} else {
					console.log(` <<< Sorry, we do not have enough product in stock, your order can not be supplied >>>`);
					console.log(` <<< Would you like change your order? >>> `);
					console.log(`\n*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n`);
					displayStock();
				}
			}
		})
	})
}

// displayStock will retrieve the current inventory from the database and output it to the console
function displayStock() {
	// console.log('___ENTER displayStock___');

	// Construct the db query string
	qryStatmnt = 'SELECT * FROM products';

	// Make the db query
	connection.query(qryStatmnt, function(err, data) {
		if (err) throw err;
		console.log(` \n Bamazon Stock: `);
		console.log(` *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);
		var dspInventory = '';
		for (var i = 0; i < data.length; i++) {
			dspInventory = '';
			dspInventory += 'Product Name: ' + data[i].product_name + '  |  ';
			dspInventory += 'Item #: ' + data[i].item_id + '  |  ';
			dspInventory += 'Price: $' + data[i].price + '  |  ';
			dspInventory += 'Department: ' + data[i].department_name + '\n';
			console.log(dspInventory);
		}
	  	console.log(` *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*\n `);
	  	//Show screen the user for item and quantity so they can purchase
	  	promptUserPurchase();
	})
}

// eBamazon execute the main application logic
function eBamazon() {
	// console.log('___ENTER eBamazon___');

	// Display the available stock 
	displayStock();
}

// Run the application logic
eBamazon();