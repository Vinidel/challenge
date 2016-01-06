var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(express.static('public'));

var restaurants = [{id:1, name:'Feijao', lastTimeVote:null, lastUser: null},
                   {id:2, name:'Sujinho', lastTimeVote:null, lastUser: null},
                   {id:3, name: 'Barba', lastTimeVote:null, lastUser: null}];
var users = [{name:'Tony Stark'}, {name:'Bruce Banner'},{name: 'That guy with wings'}];

app.get('/', function(request, response){
  response.send(index);
});

//Restaurant
app.get('/restaurants', function(request, response){

  response.json(restaurants);
});

app.put('/restaurants/:id([0-9]+)', bodyParser.json(), function(request, response){
  var restaurant = request.body;
  var result = null;
  var status = null;
  console.log(request.body)
  for (var i = 0; i < restaurants.length; i++) {
    if(restaurants[i].id === restaurant.id){
      restaurants[i].lastTimeVote   = new Date();
      restaurants[i].lastUser       = restaurant.lastUser;
      result = restaurant;
      status = 200;
    }else{
      status = 400;
      result = 'Error updating restaurant ' + restaurant.name;
    }
  }
  response.status(status).json(result);
});


/////////////

//User
app.get('/users', function(request, response){

  response.json(users);
});



module.exports = app;
