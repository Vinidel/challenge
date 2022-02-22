const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { restaurants, canVoteOnRestaurantCheck } = require('./repository/restaurant');
const {voteOnRestaurantHandler, goToRestaurantHandler} = require("./controllers/restaurant");
const {getAllUsers} = require("./repository/user");

app.use(express.static('public'));

var users = getAllUsers()
var chosenOne = null;

function sessionUserMiddleware(request, response, next) {
  const data = request.body;
  const sessionUser = users.find((e) => e.name === data.lastUser.name)
  const userIndex = users.findIndex((e) => e.name === data.lastUser.name)
  const user = {user: sessionUser, userIndex}
  request["local"] = user;
  next();
}


app.get('/', function(request, response){
  response.send(index);
});

//Restaurant
app.get('/restaurants', function(request, response){
  response.json(restaurants);
});
app.put('/restaurants/:id([0-9]+)', bodyParser.json(), sessionUserMiddleware, voteOnRestaurantHandler);
app.post('/restaurants/:id([0-9]+)/go', bodyParser.json(), goToRestaurantHandler);

//User
app.get('/users', function(request, response){
  response.json(users);
});

module.exports = app;
