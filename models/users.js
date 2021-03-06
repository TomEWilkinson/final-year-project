var mysql = require('mysql');


User = function(user_id, name, email, card_num, balance) {
	this.userID    = user_id;
	this.name      = name;
	this.email     = email;
	this.cardNum   = card_num
	this.balance   = balance

}


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'rfid_project'
});



User.prototype.save = function(){
	var post = {
		user_id: this.user_id, 
		name: this.name,
		email: this.email,
		RFID_card_num: this.cardNum,
		balance: this.balance

	};
	connection.query('insert into rfid_project.users SET ?', post , function(err, rows, fields) {
		if (err) throw err;
	});
}

User.prototype.UserExists = function(callback){
 	connection.query('SELECT * FROM rfid_project.users where email = ?', this.email ,function(err, rows, fields, result){
	   if (err) {
            callback(err,null);
        }
        else {
        	if (rows.length == 0)
        	{
        		callback(null,false);
        	} else {
        		callback(null,true);
        	}

        }
	});
}

User.prototype.GetAll = function(callback){
 	connection.query('SELECT * FROM rfid_project.users',function(err, rows, fields, result){
	   if (err) {
            callback(err,null);
        }
        else {
            callback(null,rows);
        }
	});
}

User.prototype.HasCardAssigned = function(callback){
 	connection.query('SELECT * FROM rfid_project.users where RFID_card_number = ?', this.cardNum ,function(err, rows, fields, result){
	   if (err) {
            callback(err,null);
        }
        else {
        	if (rows.length == 0)
        	{
        		callback(null,false);
        	} else {
        		callback(null,true);
        	}

        }
	});
}

User.prototype.Checkout = function(callback, balance, card_num){
	if (typeof(card_num) != "undefined" && card_num != null)
	{
		var card_num = this.cardNum;
	}
	var sql = "UPDATE users SET balance = balance - " + balance + " WHERE RFID_card_number = '" + card_num + "'";
	console.log(sql);
 	connection.query(sql, function(err, rows, fields, result){
	   if (err) {
            callback(err,null);
        }
        else {
            callback(null,rows);
        }
	});
}




module.exports.User = User;