#!/usr/bin/env node

var fs = require('fs');

var targetip = '';
var delay = 1;
var startTime;
var endTime;

var args = process.argv.slice(2);
if (args[0] != undefined && isValidIpAddress(args[0])) targetip = args[0]; else { console.log('Invalid IP Address'); process.exit(1); }
if (args[1] != undefined && parseInt(args[1]) >= 1) delay = parseInt(args[1]);
console.log("Testing %s every %s minute(s)", targetip, delay)

getTheFile();
setInterval(function(){
	getTheFile();
}, delay * 60 * 1000);

function getTheFile() {
	//test.tmp must exist in IP's HTTP root
	startTime = new Date();
	fs.appendFile('benchmarkist.log', startTime + '\t');
	download ('http://'+targetip+'/test.tmp', function(data){
		endTime = new Date();
		fs.appendFile('benchmarkist.log', endTime + '\t' + (endTime-startTime) + '\r\n');
		console.log('%dms', (endTime-startTime));
	});
}

function download(url, cb) {
	var data = '';
	var request = require('http').get(url, function(res) {
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			cb(data);
		})
	});
	request.on('error', function(e) {
		console.log('Error %s', e.message);
	})
}

function isValidIpAddress(address) {
	return address.match(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/);
}  