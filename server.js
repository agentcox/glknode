//server.js

var express 	= require('express');
var fs 			= require('fs');
var request 	= require('request');
var http		= require('http');
var es 			= require('event-stream');
var spawn 		= require('child_process').spawn;
var app			= express();
var thewindow 		= 0;
var databuf 		= "";
var databuffull		= false;
var bodyParser 	= require('body-parser');
var glk = 'gamefiles/advent.ulx'; //allow this to be passed in somehow?
var child_process = spawn('glulxe/glulxe', [glk]);

child_process.stdin.setEncoding = 'utf-8';

//process.stdout.pipe(child_process.stdin);

///When GLULXE has output for us...
child_process.stdout.on('data', function(data){
	databuf = data + '';
	databuffull = true;
})

///

app.set('port', (process.env.PORT || 8081));
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


app.listen(app.get('port'))
console.log('We are listening on ' + app.get('port'));
exports = module.exports = app;

app.get('/', function(req, res){
	console.log("GET sent!"); //At this point, just send an OK
	if(databuffull){
		console.log("Sent back last data buffer!");
		res.json({status: 'OK', message: databuf});
	}
	else{
		console.log("No data buffer to send back.");
		res.json({status: 'OK'});
	}
})

///When we have input to send to GLULXE
app.post('/', function(req, res){
	console.log("POST sent!");

	if(req.body && req.body.command){
		var decoded = '' + req.body.command;
		console.log("Incoming Command: " + decoded);

		//clear the buffer
		databuf = '';
		databuffull = false;

		child_process.stdin.write(decoded);
		child_process.stdin.write("\n"); //Need the trailing newline to tell GLULXE to interpret the line
		
		console.log("Written to GLULXE. Sending OK.");
		res.json({status: 'OK'});
	}
	else{
		console.log("POST malformed. Ignoring.");
		res.json({status: 'ERROR BAD DATA'});
	}
})