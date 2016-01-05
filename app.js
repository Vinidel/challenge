var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(request, response){
  response.send(index);
});

app.get('/restaurants', function(request, response){
  var restaurants = ['Feijao', 'Sujinho', 'Barba'];
  response.json(restaurants);
});

module.exports = app;
