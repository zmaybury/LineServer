var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var LineNavigator = require('line-navigator');

var routes = require('./routes/index');
var lines = require('./routes/lines');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/lines', lines);

// Use connect method to connect to the Server
var myDB = mongojs('line_server',["lines"]);

function cleanAndIngest(fileName) {
  //remove all existing entries and ingest new ones
  console.log("clean and Ingest");
  myDB.lines.remove({}, function(){
    console.log("removed successfully");
    navigator = new LineNavigator(__dirname + "/" + fileName,{});
    var indexToStartWith = 0;
    navigator.readSomeLines(indexToStartWith, function linesReadHandler(err, index, lines, isEof, progress) {
      console.log("Reading Some Lines");
      // Error happened
      if (err) throw err;

      // Reading lines
      var documents = [];
      for (var i = 0; i < lines.length; i++) {
        var lineIndex = index + i;
        var line = lines[i];

        // Do something with line
        documents.push({
          "lineNumber": lineIndex+1,
          "line": line
        });
      }

      myDB.lines.insert(documents, function(err,result) {
        if(err)
          throw(err);
        // End of file
        if (isEof) {
          return;
        }

        console.log("Inserted " + lineIndex + " documents into the lines collection.",documents);

        // Reading next chunk, adding number of lines read to first line in current chunk
        navigator.readSomeLines(index + lines.length, linesReadHandler);
      });
    })
  });
};

if(process.argv.length < 3) {
  console.error("Did not specify a file to use");
  process.exit(1);
}
cleanAndIngest(process.argv[2]);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
