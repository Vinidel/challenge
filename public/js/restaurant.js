function routerConfig($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('list', {
      url:'/',
      views:{
        'restView' : {templateUrl: 'partial-list.html',controller: 'MainCtrl'}
      }
    })
}

function MainCtrl($scope, RestaurantService){

  var self                    = this;

  $scope.data                 = {};
  $scope.getList              = getList;
  $scope.getUsers             = getUsers;
  $scope.chooseUser           = chooseUser;
  $scope.vote                 = vote;
  $scope.activator            = activator;

  activator();

  function activator(){
      getList();
      getUsers();
  }

  function getList(){
    RestaurantService.getRestaurants().then(function(result){
        $scope.restaurants = result.data;
    });
  }

  function getUsers(){
    RestaurantService.getUsers().then(function(result){
        $scope.users = result.data;
    });
  }

  function chooseUser(user){
      $scope.currentUser = user;
  }

  function vote(data){
      data.lastUser = $scope.currentUser;
      RestaurantService.vote(data);

  }

}

function RestaurantService( $http, $resource ) {

    var Service = {};

    Service.getRestaurants = function(){
      return $http.get('http://localhost:3000/restaurants');
    };

    Service.getUsers = function(){
      return $http.get('http://localhost:3000/users');
    };

    Service.vote = function(data){
      var url = 'http://localhost:3000/restaurants/' + data.id;
      return $http.put(url, data);
    };


    return Service;
}


angular.module('restaurant', ['ui.router', 'ngResource'])
  .controller('MainCtrl', MainCtrl)
  .factory('RestaurantService', RestaurantService)
  .config(routerConfig)
