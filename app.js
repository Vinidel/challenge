var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));

var restaurants = [{id:1, name:'Feijao', lastTimeVote:null, lastUser: null, totalVote: 0},
                   {id:2, name:'Sujinho', lastTimeVote:null, lastUser: null, totalVote: 0},
                   {id:3, name: 'Barba', lastTimeVote:null, lastUser: null, totalVote: 0}];
var users = [{name:'Tony Stark', restVisited: [], restVoted :[]}, {name:'Bruce Banner', restVisited: [], restVoted: []},{name: 'That guy with wings', restVisited: [], restVoted: []}];
var chosenOne = null;

var isOnList = function(data){
  var sessionUser  = getSessionUser(data);
  var result = false;
  for (var i = 0; i < sessionUser.restVoted.length; i++) {
    if(sessionUser.restVoted[i].name === data.name ){
      result = true;
    }
  }
  return result;
};


var checkRules = function (rest){
    var result = {};
    var date = new Date();
    var restDate = null;
    var serverDate = null;
    var sessionUser = getSessionUser(rest);
    var restDb = null;

    for (var i = 0; i < restaurants.length; i++) {
      if(restaurants[i].id === rest.id){
        restDb = restaurants[i];

        break;
      }
    }

    var existsOnList = isOnList(rest);
    rest.lastTimeVote = date;

    if(restDb.lastTimeVote === null){
      result.boolean = true;
      return result;
    }
    restDate = restDb.lastTimeVote.getDate() + '-' + restDb.lastTimeVote.getMonth();
    serverDate = date.getDate() + '-' + date.getMonth();

    if( existsOnList && (restDate === serverDate)){
      result.boolean = false;
      result.message = 'User ' +  sessionUser.name + ' has already voted on this restaurant today';
    } else {
      result.boolean = true;
    }
    return result;
};

var checkDate = function(data){
  var result = true;
  var dateId = getWeek(new Date());

  for (var i = 0; i < data.restVisited.length; i++) {
    if(data.restVisited[i].dateId === dateId){
      result = false;
    }
  }
  return result;
};

var getWeek = function(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return d.getFullYear() + '' + weekNo;
};

var getSessionUser = function(data){
  var usr = data.lastUser;
  for (var i = 0; i < users.length; i++) {
    if(users[i].name == usr.name){
       return users[i];
     }
  }
};

var getUserIndex = function(data){
  var usr = data.lastUser;
  for (var i = 0; i < users.length; i++) {
    if(users[i].name == usr.name){
       return i;
     }
  }
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
  var restDb = null;
  var user = getSessionUser(request.body);
  var usrIndex = getUserIndex(request.body);

  for (var i = 0; i < restaurants.length; i++) {
    if(restaurants[i].id === restaurant.id){
      restDb = restaurants[i];
      index = i;
    }else{
      status                        = 400;
      result                        = {error : 'Restaurant ' + restaurant.name +' not found' };
    }
  }

  var check = checkRules(restaurant);

  if(check.boolean){
    restaurants[index].lastTimeVote   = new Date();
    restaurants[index].lastUser       = restaurant.lastUser;
    restaurants[index].totalVote++;
    restaurant.lastTimeVote = restaurants[index].lastTimeVote;
    restaurant.totalVote = restaurants[index].totalVote;
    users[usrIndex].restVoted.push(restaurant);
    result = restaurant;
    result.message = 'You voted on ' + restaurant.name;
    status  = 200;
  } else {
    status  = 400;
    result  = {error : check.message};
  }
  response.status(status).json(result);
});

app.post('/restaurants/:id([0-9]+)/go', bodyParser.json(), function(request, response){
  var result = {};
  var status = null;
  var json = request.body;
  var user = null;
  var restChosen = null;
  var indexUser = null;


  for (var i = 0; i < users.length; i++) {
    if(users[i].name == json.user.name){
      user = users[i];
      indexUser = i;
      break;
    }
  }

  for (var i = 0; i < user.restVisited.length; i++) {

     if (user.restVisited[i].id == json.id){
       restChosen = user.restVisited[i];
       break;
     }
  }


  if(user.restVisited.length === 0 || restChosen === null || checkDate(user)  ){

    var newRest = {id: json.id, dateVisited: new Date(), dateId: getWeek(new Date())};
    users[indexUser].restVisited.push(newRest);
    status = 200;
    result = users[indexUser];
    result.message = 'Have fun at ' + json.name;

  } else {
      status = 400;
      result.message = 'OOOps! You have chosen this restaurant this week!';
    }
  response.status(status).json(result);
});

app.get('/restaurants/chosen', bodyParser.json(), function(request, response){
  var result = {};
  var status = null;

  if(chosenOne === {}){
    status = 400;
    result.message = "Not found";
  } else {
    status = 200;
    result = chosenOne;
  }
  response.status(status).json(result);
});


/////////////

//User
app.get('/users', function(request, response){

  response.json(users);
});

module.exports = app;
