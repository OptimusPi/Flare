var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var fs = require('fs');

//TODO learn how to use node.js exports instead (or some other better way)
function importCode(script){
  var fileName = path.join(__dirname, script + '.js');
  return eval(fs.readFileSync(fileName)+'');
}

//Local shared game files
importCode('../public/scripts/debug');

app.use(express.static(path.join(__dirname, '../public'))) ;

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname });
});

http.listen(3042, function(){
  console.log('listening on *:3042');
});