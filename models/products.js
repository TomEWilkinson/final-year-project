var mysql = require('mysql');


Product = function(product_id, name, price, img, event_name) {
	this.productId = product_id;
	this.name      = name;
	this.price     = price;
	this.img       = img
	this.eventName = event_name

}


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'rfid_project'
});



Product.prototype.save = function(){
	var post = {
		product_id: this.product_id, 
		name: this.name,
		img: this.img,
		price: this.price,
		event_name: this.eventName

	};
	connection.query('insert into rfid_project.event_products SET ?', post , function(err, rows, fields) {
		if (err) throw err;
	});
}

Product.prototype.GetAll = function(callback){
 	connection.query('SELECT * FROM rfid_project.event_products',function(err, rows, fields, result){
	   if (err) {
            callback(err,null);
        }
        else {
            callback(null,rows);
        }
	});
}

Product.prototype.GetAllFromEvent = function(callback, event_name){
	var event = [event_name]
 	connection.query('SELECT * FROM rfid_project.event_products where event_name = ?', event, function(err, rows, fields, result){
	   if (err) {
            callback(err,null);
        }
        else {
            callback(null,rows);
        }
	});
}




module.exports.Product = Product;