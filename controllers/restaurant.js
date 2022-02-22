const {restaurants, canVoteOnRestaurantCheck} = require("../repository/restaurant");
const {getAllUsers} = require("../repository/user");

function voteOnRestaurantHandler(request, response){
  var restaurant = request.body;
  let result = null;
  let status = null;
  let restaurantIndex = null;
  const users = getAllUsers()
  let restDb = null;
  const user = request.local.user;
  const usrIndex = request.local.userIndex;

  for (var i = 0; i < restaurants.length; i++) {
    if(restaurants[i].id === restaurant.id){
      restDb = restaurants[i];
      restaurantIndex = i;
    }else{
      status = 400;
      result = {error : 'Restaurant ' + restaurant.name +' not found' };
    }
  }

  const check = canVoteOnRestaurantCheck(restaurant, user);

  if(check.boolean){
    restaurants[restaurantIndex].lastTimeVote   = new Date();
    restaurants[restaurantIndex].lastUser       = restaurant.lastUser;
    restaurants[restaurantIndex].totalVote++;
    restaurant.lastTimeVote = restaurants[restaurantIndex].lastTimeVote;
    restaurant.totalVote = restaurants[restaurantIndex].totalVote;
    users[usrIndex].restVoted.push(restaurant);
    console.log(users[usrIndex])
    result = restaurant;
    result.message = 'You voted on ' + restaurant.name;
    status  = 200;
  } else {
    status  = 400;
    result  = {error : check.message};
  }
  response.status(status).json(result);
}

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

function goToRestaurantHandler(request, response){
  var result = {};
  var status = null;
  var json = request.body;
  var user = null;
  var restChosen = null;
  var indexUser = null;
  const users = getAllUsers()

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
}

module.exports = {
  voteOnRestaurantHandler,
  goToRestaurantHandler
}
