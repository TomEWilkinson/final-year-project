var express = require('express');
var scanners = require('../models/scanners');
var events = require('../models/events');
var Phidget = require('phidgetapi').RFID;
var when = require('when-then');
var router = express.Router();

var RFID=new Phidget;

var scannerNum;

router.get('/', function(req, res, next) {
	RFID.connect();
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
  	5
	}
  );
  var event = new events.Event();
  var eventList;
  event.GetAll(function(err,data){
        if (err) {
            console.log("ERROR : ",err);            
        } else {            
            eventList = data;
            setTimeout(function(){ res.render('scanneradmin', { scannerNum: scannerNum, eventList: eventList }); }, 500);
        }     
    });
});

router.post('/', function(req, res, next) {
  var scanner = new scanners.scanner(scannerNum, req.body.scannerLat, req.body.scannerLon, req.body.eventName, req.body.scannerLocation);
  var msg = scanner.save();
  var event = new events.Event();
  var eventList;
  event.GetAll(function(err,data){
        if (err) {
            console.log("ERROR : ",err);            
        } else {            
            eventList = data;
            setTimeout(function(){ res.render('scanneradmin', { scannerNum: scannerNum, eventList: eventList }); }, 500);
        }     
    });

});

module.exports = router;
