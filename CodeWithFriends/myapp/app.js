
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
var databaseUrl = "rluo:arroke@ds053788.mongolab.com:53788/codewithfriends";
var collections = ["CodeWithFriends"]
var db = require("mongojs").connect(databaseUrl, collections);
var magic = require("./magic")

function merge(left, right){
    var result  = [],
        il      = 0,
        ir      = 0;

    while (il < left.length && ir < right.length){
        if (left[il] < right[ir]){
            result.push(left[il++]);
        } else {
            result.push(right[ir++]);
        }
    }

    return result.concat(left.slice(il)).concat(right.slice(ir));
}

function mergeSort(items){

    // Terminal case: 0 or 1 item arrays don't need sorting
    if (items.length < 2) {
        return items;
    }

    var middle = Math.floor(items.length / 2),
        left    = items.slice(0, middle),
        right   = items.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}
var shift = function(list){
        for(var i = list.length; i>0; i--){
                list[i]=list[i-1]
        }
        list[0] = 0
}
var normalize = function(obj){
        if(typeof obj[0]=='number'&& obj[0] > 0){

        } else{
                shift(obj)
        }
        if(!obj[2]){
                obj[2]=0
        }
}

var reconstruct = function(dict){
        keys = [] 
        for(var key in dict){
                keys.push(key)
                normalize(dict[key].o)
        }
        keys = mergeSort(keys);
        for(var key in keys){
        //      console.log(dict[keys[key]].o)
        }
        var write = ""
        counter=0;
        for(var key in keys){
		if(key!="_id"){
                var input = dict[keys[key]].o
                if(typeof input[1]=='number'){
                        if(input[2]==0)
                                write = write.substring(0,write.length-1)
                        else    
                                write = write.substring(0,input[0])+write.substring(input[0]+(-1*input[1]))
                }
                else 
                        write = [write.slice(0,input[0]),input[1],write.slice(input[0])].join('')
                counter++}
                //if(counter<50)
                //      console.log(write)
        }
        return write
} 



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

app.get('/hardSaves', function(req,res){
    dataRef.on('value', function(snapshot) {
	db.CodeWithFriends.save(snapshot.val());
    });
    res.redirect('/');
});

app.get('/reconstruct/:id',function(req,res){
    var id = parseInt(req.params.id);
    var write = ""
    db.CodeWithFriends.find({},function(err,CodeWithFriends){
    	if (err || !CodeWithFriends) console.log("Error");
	else{
     	  var json = CodeWithFriends[id]
	  keys= []
	  for(var key in json){
	     if(key!="_id"){
	     keys.push(key)
	     normalize(json[key].o)}
	  }console.log(keys)
	  keys = mergeSort(keys) 
	  write = ""
	  for(var key in keys){ 
		var input = json[keys[key]].o
		if(typeof input[1]=='number'){
			if(input[2]==0)
				write = write.substring(0,write.length-1)
			else
				write = write.substring(0,input[0])+write.substring(input[0]+(-1*input[1]))
		}
		else
			write = [write.slice(0,input[0]),input[1],write.slice(input[0])].join('')
		}
	}
        console.log(write)
	//text = reconstruct(CodeWithFriends[0])
    	res.render('text',{text:write});
    });
    console.log(write+";sdifj");
    res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

