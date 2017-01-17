var express = require('express');
var scanners = require('../models/scanners');
var events = require('../models/events');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var event = new events.Event();
	var eventList;
	event.GetAll(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			eventList = data;
		}     
	})
	var scanner = new scanners.Scanner();
	var scannerList;
	scanner.GetAllFromEvent(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			scannerList = data;
			res.render('scannermap', { scannerList: scannerList , eventList:eventList});

		}     
	}, "TestEvent");
});

router.post('/', function(req, res, next) {
	var scanner = new scanners.Scanner();
	var scannerList;
	scanner.GetAllFromEvent(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			scannerList = data;
			GetEventList(res, scannerList);

		}     
	}, req.body.eventName);

});

function GetEventList(res, scannerList){
	var event = new events.Event();
	var eventList;
	event.GetAll(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			eventList = data;
			console.log(scannerList);
			res.render('scannermap', { scannerList: scannerList , eventList: eventList});
		}     
	});
}
module.exports = router;
