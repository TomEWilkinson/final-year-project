var express = require('express');
var scanners = require('../models/scanners');
var Phidget = require('phidgetapi').RFID;
var when = require('when-then');
var router = express.Router();

var RFID=new Phidget;

var scannerNum;

router.get('/', function(req, res, next) {
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
		scannerNum = RFID.phidget.data.serial;
  		res.render('scanneradmin', { scannerNum: scannerNum });
	}
  );
  RFID.connect();
});

function getScannerNum(){

}
router.post('/', function(req, res, next) {
  res.render('scanneradmin', { scannerNum: scannerNum });
  var scanner = new scanners.scanner(scannerNum, req.body.scannerLat, req.body.scannerLon, req.body.eventName, req.body.scannerLocation);
  var msg = scanner.save();
});

module.exports = router;
