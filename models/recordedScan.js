var mysql      = require('mysql');
var moment      = require('moment');




RecordedScan = function(card_id, reader_id, scanned_time) {
	this.cardId      = card_id;
	this.readerId    = reader_id;
	this.scannedTime = moment().format('YYYY-MM-DD H:mm:ss');
	if (scanned_time != null) {
		this.scannedTime = scanned_time;
	}
	
}


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'rfid_project'
});



RecordedScan.prototype.save = function(){
	var post = {
		card_id: this.cardId, 
		reader_id: this.readerId, 
		scanned_time: this.scannedTime
	};
	connection.query('insert into rfid_project.recorded_scans SET ?', post , function(err, rows, fields) {
		if (err) throw err;
	});
}




module.exports.RecordedScan = RecordedScan;