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

.controller('HouseCtrl', function($scope, $http, $ionicModal, $ionicListDelegate, $ionicLoading, $ionicPopup,Data, Util) {
	$scope.newHouse = {}
	$scope.curHouse = {}

	$ionicModal.fromTemplateUrl('templates/house-add.html', {
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.houseModalAdd = modal;
	});
	$ionicModal.fromTemplateUrl('templates/house-edit.html', {
	  scope: $scope,
	  animation: 'slide-in-up'
	}).then(function(modal) {
	  $scope.houseModalEdit = modal;
	});
	$scope.showConfirm = function() {
	  var confirmPopup = $ionicPopup.confirm({
	    title: '确认删除',
	    template: '是否删除订货会信息？',
	    buttons: [
	          { text: '否' },
	          {
	            text: '<b>是</b>',
	            type: 'button-positive',
	            onTap: function(){
	            	return true
	            }
	          }
	        ]
	  });
	  return confirmPopup.then(function(res) {
	  	console.log(res)
	    if(res) {
	      $scope.confirmDelete = true
	      console.log('true')
	    } else {
	      $scope.confirmDelete = false
	    }
	  });
	};
	$scope.edit = function(house){
		$scope.curHouse = house;
		$scope.curHouse.start = new Date(house.start)
		$scope.curHouse.end = new Date(house.end)
		console.log($scope.curHouse)
		$ionicListDelegate.closeOptionButtons();
		$scope.houseModalEdit.show();
	}
	$scope.remove = function(house, index){
		$scope.showConfirm().then(function(){
			if (!$scope.confirmDelete) {
				return
			}
			$http.delete(Util.server + "/houses/" + house._id).success(function(data){
				if (data.code == "200") {
					$scope.houses.splice(index, 1)
					Data.refreshHouses();
					$ionicListDelegate.closeOptionButtons();
				}
			})	
		})
	}
	$scope.getLatestHouses = function(){
		Data.refreshHouses().then(function(){
			$scope.houses = Data.allHouses();
			$scope.$broadcast('scroll.refreshComplete')
		})
	}
	$scope.submitAdd = function(){
		$http.post(Util.server + "/houses", $scope.newHouse).success(function(data){
			var tmp = ''
			if(data.code == "200"){
				tmp = "已经成功新建"
				Data.refreshHouses().then(function(){
					$scope.houses = Data.allHouses()
				})
			} else {
				tmp = data.data
			}
			var alertPopup = $ionicPopup.alert({
			  title: '操作状况',
			  template: tmp
			});
		})
	}
	$scope.submitEdit =  function(){
		$http.put(Util.server + "/houses", $scope.curHouse).success(function(data){
			console.log(data)
		})
	}
	$scope.getLatestHouses();
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