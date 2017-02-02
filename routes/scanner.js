var express = require('express');
var RecordedScan = require('../models/recordedScan');
var users = require('../models/users');
var router = express.Router();
var Phidget = require('phidgetapi').RFID;

var RFID=new Phidget;
var msg = "";  


router.get('/', function(req, res, next) {

	RFID.observeBoard(update);

	RFID.whenReady(
		function(){
		//turn on the antenna when available and blink the LED so we know it is ready.
		RFID.antennaOn=1;
		RFID.LEDOn=1;
		setTimeout(
			function(){
				RFID.LEDOn=0;
			},
			250
			)
	}
	);

	RFID.connect();

	function update(changes){
		
		for(var i in changes){
				var change=changes[i];
		}

		//light the LED while the tag is present
		if(RFID.tagState==1 && RFID.LEDOn==0 && RFID.tag2.tag){
			RFID.LEDOn=1;
			msg = String(RFID.tag2.tag) + " Has Been  Scanned by " + RFID.phidget.data.serial;
			var recordedScan = new RecordedScan.RecordedScan(RFID.tag2.tag, RFID.phidget.data.serial);
			recordedScan.save();
			res.io.emit("scans", msg);

			var user = new users.User(null, null, null, RFID.tag2.tag, null);
			user.HasCardAssigned(function(err,data){
				if (err) {
					console.log("ERROR : ",err);            
				} else {            
					if (data)
					{
						console.log("Card already has user assigned :)")
					} else {
						res.io.emit("cardAssignment", user.cardNum);
					}

				}     
			});

		}

		//turn off the LED if no tag is present
		if(RFID.tagState==0){
			RFID.LEDOn=0;
		}

	}

	res.render('scanner', { scanned: msg });
}); 
router.post('/', function(req, res, next) {
	req.body.eventName
	var user = new users.User(null, req.body.name, req.body.email, req.body.cardNum, null);
	user.UserExists(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			if (data)
			{
				console.log("User exists");
				user.save();
			} else {
				console.log("User does not exist");
				res.io.emit("userError");
			}

		}     
	});

});


module.exports = router;
