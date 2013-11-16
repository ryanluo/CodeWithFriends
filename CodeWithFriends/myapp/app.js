
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo = require("mongodb");
var monk = require('monk');
var db = monk('localhost:27017/test');
var app = express();
var Firebase = require('firebase');
var myRootRef = new Firebase('https://fire-base-test.firebaseio.com/');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
var dataRef = new Firebase('https://fire-base-test.firebaseio.com/history');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/insert',function(req,res){
   var collection = db.get('usercollection');
   collection.insert({"username": "Ryan",
		      "email" : "alseijra;f"
   });
   res.redirect('/')

});

app.get('/hardSaves', function(req,res){
    dataRef.on('value', function(snapshot) {
	var collection = db.get('usercollection');
	collection.insert(snapshot.val());
    });
    res.redirect('/');
});

app.get('/reconstruct',function(req,res){
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

