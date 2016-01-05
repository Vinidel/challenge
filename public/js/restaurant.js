function routerConfig($urlRouterProvider, $stateProvider){
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('list', {
      url:'/',
      templateUrl: 'partial-list.html',
      controller: 'MainCtrl'
    })
}

function MainCtrl($scope, RestaurantService){

  var self           = this;
  $scope.getList     = getList;
  $scope.activator   = activator;

  activator();

  function activator(){
      getList();
  }


  function getList(){
    RestaurantService.getRestaurants().then(function(result){
        $scope.restaurants = result.data;
    });
  }
}

function RestaurantService( $http, $resource ) {


    var Service = {};

    Service.getRestaurants = function(){

        return $http.get('http://localhost:3000/restaurants');
    };

    return Service;
}


angular.module('restaurant', ['ui.router', 'ngResource'])
  .controller('MainCtrl', MainCtrl)
  .factory('RestaurantService', RestaurantService)
  .config(routerConfig)
