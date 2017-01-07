var mysql      = require('mysql');



scanner = function(scanner_id, scanner_lat, scanner_lon, event, location) {
	this.scannerId  = scanner_id;
	this.scannerLat = scanner_lat;
	this.scannerLon = scanner_lon;
	this.event      = event;
	this.location   = location;
	
}


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'rfid_project'
});



scanner.prototype.save = function(callback){
	var msg = "entry sucessful :)";
	var post = {
		scanner_id:  this.scannerId, 
		scanner_lat: this.scannerLat, 
		scanner_lon: this.scannerLon,
		event:       this.event,
		location:    this.location,

	};
	connection.query('insert into rfid_project.scanners SET ?', post , function(err, rows, fields) {
		if (err) msg = err;
		console.log(err);
	}); 
	
}




module.exports.scanner = scanner;