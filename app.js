var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(express.static('public'));

var restaurants = [{id:1, name:'Feijao', lastTimeVote:null, lastUser: null, totalVote: 0},
                   {id:2, name:'Sujinho', lastTimeVote:null, lastUser: null, totalVote: 0},
                   {id:3, name: 'Barba', lastTimeVote:null, lastUser: null, totalVote: 0}];
var users = [{name:'Tony Stark'}, {name:'Bruce Banner'},{name: 'That guy with wings'}];

var checkRules = function(restDb, rest){
    var result = {};
    var date = new Date();
    var restDate = null;
    var serverDate = null;
    rest.lastTimeVote = date;

    if(restDb.lastTimeVote === null){
    result.boolean = true;
    return result;
    }
    restDate = restDb.lastTimeVote.getDate() + '-' + restDb.lastTimeVote.getMonth();
    serverDate = date.getDate() + '-' + date.getMonth();

    if((restDb.lastUser.name === rest.lastUser.name) && (restDate === serverDate)){
      result.boolean = false;
      result.message = 'User ' +  restDb.lastUser.name + ' has already voted on this restaurant today';
    } else {
      result.boolean = true;
    }
    return result;
};

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
  var index = null;


  for (var i = 0; i < restaurants.length; i++) {
    if(restaurants[i].id === restaurant.id){
      index = i;
    }else{
      status                        = 400;
      result                        = {error : 'Restaurant ' + restaurant.name +' not found' };
    }
  }

  var check = checkRules(restaurants[index], restaurant);

  if(check.boolean){
    restaurants[index].lastTimeVote   = new Date();
    restaurants[index].lastUser       = restaurant.lastUser;
    restaurants[index].totalVote++;
    restaurant.lastTimeVote = restaurants[index].lastTimeVote;
    restaurant.totalVote = restaurants[index].totalVote;
    result                        = restaurant;
    result.message                = 'You voted on ' + restaurant.name;
    status                        = 200;
  } else {
    status                        = 400;
    result                        = {error : check.message};
  }
  response.status(status).json(result);
});


/////////////

//User
app.get('/users', function(request, response){

  response.json(users);
});

module.exports = app;
