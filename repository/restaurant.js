const restaurants = [
  {id:1, name:'Feijao', lastTimeVote:null, lastUser: null, totalVote: 0},
  {id:2, name:'Sujinho', lastTimeVote:null, lastUser: null, totalVote: 0},
  {id:3, name: 'Barba', lastTimeVote:null, lastUser: null, totalVote: 0}
];

const isOnList = function(data, sessionUser){
  let result = false;
  console.log(sessionUser)
  console.log(data)
  for (let i = 0; i < sessionUser.restVoted.length; i++) {
    if(sessionUser.restVoted[i].name === data.name ){
      result = true;
    }
  }
  return result;
};


const canVoteOnRestaurantCheck = function (rest, sessionUser){
  const result = {};
  const date = new Date();
  let restaurantVoteDate = null;
  let serverDate =  date.getDate() + '-' + date.getMonth();
  let restaurantDb = null;

  for (let i = 0; i < restaurants.length; i++) {
    if(restaurants[i].id === rest.id){
      restaurantDb = restaurants[i];
      break;
    }
  }

  const existsOnList = isOnList(rest, sessionUser);
  rest.lastTimeVote = date;

  if(restaurantDb && restaurantDb.lastTimeVote === null){
    result.boolean = true;
    return result;
  }
  restaurantVoteDate = restaurantDb.lastTimeVote.getDate() + '-' + restaurantDb.lastTimeVote.getMonth();
  if( existsOnList && (restaurantVoteDate === serverDate)){
    result.boolean = false;
    result.message = 'User ' +  sessionUser.name + ' has already voted on this restaurant today';
  } else {
    result.boolean = true;
  }
  return result;
};

module.exports = {
  canVoteOnRestaurantCheck,
  restaurants
}
