var express = require('express');
var products = require('../models/products');
var events = require('../models/events');
var users = require('../models/users');
var router = express.Router();
var Phidget = require('phidgetapi').RFID;

var RFID=new Phidget;
var card_num;

router.get('/', function(req, res, next) {
	var event = new events.Event();
	var eventList;
	event.GetAll(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			eventList = data;
			res.render('till', {eventList: eventList });
		}     
	})
	MonitorRFID();
});

router.post('/', function(req, res, next) {
	var event = new events.Event();
	event.GetAll(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			DisplayProducts(res, req.body.eventName, data);
		}     
	});

});

router.post('/checkout', function(req, res, next) {

   var user = new users.User(card_num);

   user.Checkout(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			eventList = data;
		}  
	}, req.body.total, card_num)

	var event = new events.Event();
	var eventList;
	event.GetAll(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			eventList = data;
			res.render('till', {eventList: eventList });
		}     
	})
});

function DisplayProducts(res, EventName, eventList){
	var product = new products.Product();
	var productList;
	product.GetAllFromEvent(function(err,data){
		if (err) {
			console.log("ERROR : ",err);            
		} else {            
			productList = data;
			console.log(productList);
			res.render('till', { products: productList, eventList: eventList });
		}     
	}, EventName);
}
function MonitorRFID(){

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
			card_num = RFID.tag2.tag
		}

		//turn off the LED if no tag is present
		if(RFID.tagState==0){
			RFID.LEDOn=0;
		}

	}
}
module.exports = router;
