angular.module('starter.controllers', [])

.controller('OrderCtrl', function($scope, $http, $ionicListDelegate, $ionicLoading, Data, Util) {
	$scope.genImgUrl = function(path) {
		return Util.genImgUrl(path)
	}
	$scope.remove = function(order, index){
		$http.delete(Util.server + "/orders/" + order._id).success(function(data){
			if (data.code == "200") {
				$scope.orders.splice(index, 1)
				Data.refreshOrders();
			}
		})
	}
	$scope.edit = function(order){
		if (angular.isArray(order)){
			order.foreach(function(obj){
				obj.done = true;
			})
		} else {
			order.done = true;
		}
		$http.put(Util.server + "/orders", order).success(function(data){
			$ionicListDelegate.closeOptionButtons();
			if (data.code == "200"){
			}
		})
	}

  	$scope.getLatestOrders = function(){
  		Data.refreshOrders().then(function(){
  			$scope.orders = Data.allOrders();
  			$scope.$broadcast('scroll.refreshComplete');
  		})
  	}
  	$scope.getLatestOrders();
})

.controller('ClothCtrl', function($scope, $http, $ionicModal, $ionicListDelegate, $ionicLoading, Data, Util) {
	$scope.curItem = {};
	$scope.newItem = {

	};
	$ionicModal.fromTemplateUrl('templates/item-edit.html', {
	  id: "itemEdit",
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.itemModalEdit = modal;
	});
	$ionicModal.fromTemplateUrl('templates/item-add.html', {
	  id: "itemAdd",
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.itemModalAdd = modal;
	});
	$scope.genImgUrl = function(path) {
		return Util.genImgUrl(path)
	}
	$scope.edit = function(item){
		$scope.curItem = item;
		console.log($scope.curItem)
		$ionicListDelegate.closeOptionButtons();
		$scope.itemModalEdit.show();
	}
	$scope.remove = function(item, index){
		$http.delete(Util.server + "/items/" + item._id).success(function(data){
			if (data.code == "200") {
				$scope.cloth.splice(index, 1)
				Data.refreshCloth();
				$ionicListDelegate.closeOptionButtons();
			}
		})
	}
	$scope.submitEdit = function(){
		$http.put(Util.server + "/items", $scope.curItem).success(function(){
			getLatestCloth();
			$scope.itemModalEdit.hide();
		})
	}
	$scope.submitAdd = function(){

		if (!$scope.newItem.fd) $scope.newItem.fd = new FormData();
		for (key in $scope.newItem) {
			if (key == "fd") continue;
			$scope.newItem.fd.append(key, $scope.newItem[key])
		}
		console.log($scope.newItem.fd)
		$http.post(Util.server + "/items", $scope.newItem.fd, {
			headers: {'Content-Type': undefined },
		}).success(function(data){
			if (data.code == "200") {
				$ionicLoading.hide();
				$scope.itemModalAdd.hide();
				$scope.newItem = {};
				$scope.getLatestCloth();
			}
		}).error(function(err){

		})
		$ionicLoading.show({
			template: "正在提交"
		})
	}

	$scope.getLatestCloth = function (){
		Data.refreshCloth().then(function(){
			$scope.cloth = Data.allCloth();
			$scope.$broadcast('scroll.refreshComplete');
		})
	}
	$scope.getLatestCloth();
  	
  	$scope.addFile = function(files) {
  	    if (!$scope.newItem.fd) $scope.newItem.fd = new FormData();
  	    $scope.newItem.fd.append("file", files[0]);
  	};
})