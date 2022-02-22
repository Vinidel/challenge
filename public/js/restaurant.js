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
  $scope.go                   = go;
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

  function go(data){
    //TODO Conitnue this function
    if($scope.currentUser != null){
      data.user = $scope.currentUser;
      RestaurantService.go(data).then(
        function successCallback(result){
            getUsers();
            getList();
            chooseUser(result.data);
            swal(result.data.message , null , "success");
        },

        function errorCallback(result){
            swal(result.data.message, null, "error");
        });
    } else {
      swal("OOps! Please choose an user!", null, 'error');
    }
  }

  function vote(data){
    if($scope.currentUser != null){
      data.lastUser = $scope.currentUser;
      RestaurantService.vote(data).then(
        function successCallback(result){
            getList();
            getUsers();
            swal(result.data.message , null , "success");
        },

        function errorCallback(result){
            swal(result.data.error, null, "error");
        });
    }else {
       swal("OOps! Please choose an user!", null, 'error');
    }

  }

}

function RestaurantService( $http, $resource ) {

    var Service = {};
    var address = 'http://localhost:3000'

    Service.getRestaurants = function(){
      return $http.get(address + '/restaurants');
    };

    Service.getUsers = function(){
      return $http.get(address + '/users');
    };

    Service.vote = function(data){
      var url = address + '/restaurants/' + data.id;
      return $http.put(url, data);
    };

    Service.go = function(data){
      var url = address + '/restaurants/' + data.id + '/go';
      return $http.post(url, data);
    };


    return Service;
}


angular.module('restaurant', ['ui.router', 'ngResource'])
  .controller('MainCtrl', MainCtrl)
  .factory('RestaurantService', RestaurantService)
  .config(routerConfig)
