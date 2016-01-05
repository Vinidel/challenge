var express = require('express');
var app = express();


app.get('/', function(request, response){
  response.send('OK');
});

app.get('/restaurants', function(request, response){
  var restaurants = ['Feijao', 'Sujinho', 'Barba'];
  response.json(restaurants);        
});

module.exports = app;
