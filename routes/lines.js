var express = require('express');
var mongodb = require('mongodb');
var mongojs = require('mongojs');
var router = express.Router();


// Use connect method to connect to the Server

/* GET line. */
router.get('/:lineNumber', function(req, res, next) {
	// Connect to mongodb server
	var myDB = mongojs('line_server',["lines"]);
	myDB.lines.count({},function(error,count) {
		if(req.params.lineNumber > count) {
			return res.status(413).send('Requested line beyond end of document');
		} else {
			var lines = myDB.lines.find({lineNumber:Number(req.params.lineNumber)});
			lines.forEach(function(err, result) {
				if (!result) {
					// No docs returned from request
					return;
					//return res.status(413).send('Requested line not found');
				}
				if (err) {
					return res.status(503).send('Database Error').end();
				} else if (result.line) {
					return res.status(200).send({lineNumber: req.params.lineNumber, "text": result.line})
				} else {
					return res.status(413).send('Requested line not found');
				}
				// doc is a document in the collection
				myDB.close();
			});
		}
	});
});

function cleanup(options, err) {
	console.error(err);
	console.log("Closed out remaining connections.");
	console.log("Process ID: " + process.pid);
	process.exit(0);

	sockets.forEach(function(socket) {
		socket.destroy();
	});
}

//do something when app is closing
//process.on('exit', cleanup.bind(null,{db:dbConnection}));

//catches ctrl+c event
//process.on('SIGINT', cleanup.bind(null, {db:dbConnection}));
//process.on('SIGTERM', cleanup.bind(null, {db:dbConnection}));

//catches uncaught exceptions
//process.on('uncaughtException', cleanup.bind(null, {db:dbConnection}));

module.exports = router;
