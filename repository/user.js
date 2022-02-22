const users = [{name:'Tony Stark', restVisited: [], restVoted :[]}, {name:'Bruce Banner', restVisited: [], restVoted: []},{name: 'That guy with wings', restVisited: [], restVoted: []}];
let chosenOne = null;

const getSessionUser = function(data){
  const usr = data.lastUser;
  for (let i = 0; i < users.length; i++) {
    if(users[i].name == usr.name){
      return users[i];
    }
  }
};

const getAllUsers = () => users;

module.exports = {
  getAllUsers
}
