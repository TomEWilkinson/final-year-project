var express = require('express');
var RecordedScan = require('../models/recordedScan');
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
		}

		//turn off the LED if no tag is present
		if(RFID.tagState==0){
			RFID.LEDOn=0;
		}

	}

	res.render('scanner', { scanned: msg });
}); 

function saveScan(cardId, readerId){

		
	}


module.exports = router;
