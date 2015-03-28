angular.module('starter.services', [])

.factory('Data', function($http, Util) {

  var cloth = [];
  var orders = [];

  return {
    allOrders: function() {
      return orders;
    },
    refreshOrders: function(){
      return $http.get(Util.server + "/orders").success(function(data){
        orders = data;
      })
    },
    allCloth: function(){
      return cloth;
    },
    refreshCloth: function(){
      return $http.get(Util.server + "/items").success(function(data){
        cloth = data;
      })
    },
  };
})

.factory('Util', function(){
  var localServer = "http://127.0.0.1:3000"
  var remoteServer = "http://104.236.143.76:3000"
  return {
    server: remoteServer,
    genImgUrl: function(path){
      return this.server + path;
    }
  }
})
