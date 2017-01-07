var mysql = require('mysql');


Event = function(event_name, event_location) {
	this.eventName     = event_name;
	this.eventLocation = event_location;
}


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'rfid_project'
});



Event.prototype.save = function(){
	var post = {
		event_name: this.eventName, 
		event_location: this.eventLocation
	};
	connection.query('insert into rfid_project.events SET ?', post , function(err, rows, fields) {
		if (err) throw err;
	});
}

Event.prototype.GetAll = function(callback){
 	connection.query('SELECT * FROM rfid_project.events',function(err, rows, fields, result){
	   if (err) 
            callback(err,null);
        else
            callback(null,rows);
	});
}




module.exports.Event = Event;