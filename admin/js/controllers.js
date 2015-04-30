angular.module('starter.controllers', ["angles"])

.controller('OrderCtrl', function($scope, $http, $ionicListDelegate, $ionicLoading, Data, Util) {
    $scope.genImgUrl = function(path) {
        return Util.genImgUrl(path)
    }
    $scope.remove = function(order, index) {
        $http.delete(Util.server + "/orders/" + order._id).success(function(data) {
            if (data.code == "200") {
                $scope.orders.splice(index, 1)
                Data.refreshOrders();
            }
        })
    }
    $scope.edit = function(order) {
        if (angular.isArray(order)) {
            order.foreach(function(obj) {
                obj.done = true;
            })
        } else {
            order.done = true;
        }
        $http.put(Util.server + "/orders", order).success(function(data) {
            $ionicListDelegate.closeOptionButtons();
            if (data.code == "200") {}
        })
    }

    $scope.getLatestOrders = function() {
        Data.refreshOrders().then(function() {
            $scope.orders = Data.allOrders();
            $scope.$broadcast('scroll.refreshComplete');
        })
    }
    $scope.getLatestOrders();
})

.controller('HouseCtrl', function($scope, $http, $ionicModal, $ionicListDelegate, $ionicLoading, $ionicPopup, Data, Util) {
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
    $ionicModal.fromTemplateUrl('templates/log-in.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
        $scope.loginModal.show()
    });
    $scope.loginData = {}
    $scope.login = function(){
    	$http.get(Util.server + "/admins?pwd=" + $scope.loginData.pwd + "&name=" + $scope.loginData.name).success(function(data){
    		if (data.code != 200) {
    			$ionicPopup.alert({
    				title: "密码错误！"
    			})
    		} else {
    			$scope.loginModal.hide()
    		}
    	})
    }

    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '确认删除',
            template: '是否删除订货会信息？',
            buttons: [{
                text: '否'
            }, {
                text: '<b>是</b>',
                type: 'button-positive',
                onTap: function() {
                    return true
                }
            }]
        });
        return confirmPopup.then(function(res) {
            console.log(res)
            if (res) {
                $scope.confirmDelete = true
                console.log('true')
            } else {
                $scope.confirmDelete = false
            }
        });
    };
    $scope.edit = function(house) {
        $scope.curHouse = house;
        $scope.oldHouseId = house._id
        $scope.curHouse.start = new Date(house.start)
        $scope.curHouse.end = new Date(house.end)
        $ionicListDelegate.closeOptionButtons();
        $scope.houseModalEdit.show();
    }
    $scope.remove = function(house, index) {
        $scope.showConfirm().then(function() {
            if (!$scope.confirmDelete) {
                return
            }
            $http.delete(Util.server + "/houses/" + house._id).success(function(data) {
                if (data.code == "200") {
                    $scope.houses.splice(index, 1)
                    Data.refreshHouses();
                    $ionicListDelegate.closeOptionButtons();
                }
            })
        })
    }
    $scope.getLatestHouses = function() {
        Data.refreshHouses().then(function() {
            $scope.houses = Data.allHouses();
            $scope.$broadcast('scroll.refreshComplete')
        })
    }
    $scope.submitAdd = function() {
        $http.post(Util.server + "/houses", $scope.newHouse).success(function(data) {
            var tmp = ''
            if (data.code == "200") {
                tmp = "已经成功新建"
                Data.refreshHouses().then(function() {
                    $scope.houses = Data.allHouses()
                    $scope.houseModalAdd.hide()
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
    $scope.submitEdit = function() {
        $http.put(Util.server + "/houses/" + $scope.oldHouseId, $scope.curHouse).success(function(data) {
            if (data.code == "200") {
                tmp = "已经成功更改"
                Data.refreshHouses().then(function() {
                    $scope.houses = Data.allHouses()
                    $scope.houseModalEdit.hide()
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
    $scope.getLatestHouses();
})

.controller('ClothCtrl', function($scope, $http, $ionicModal, $ionicListDelegate, $ionicLoading, Data, Util) {
        $scope.materialMap = Data.materialMap
        $scope.typeMap = Data.typeMap
        $scope.yearMap = {
            2014: "14",
            2015: "15",
            2016: "16",
        }
        $scope.colorArr = Data.colorArr
        $scope.sizeArr = Data.sizeArr
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
        $scope.edit = function(item) {
            $scope.curItem = item;
            $ionicListDelegate.closeOptionButtons();
            $scope.itemModalEdit.show();
        }
        $scope.remove = function(item, index) {
            $http.delete(Util.server + "/items/" + item._id).success(function(data) {
                if (data.code == "200") {
                    $scope.cloth.splice(index, 1)
                    Data.refreshCloth();
                    $ionicListDelegate.closeOptionButtons();
                }
            })
        }
        $scope.submitEdit = function() {
            $http.put(Util.server + "/items", $scope.curItem).success(function() {
                $scope.getLatestCloth();
                $scope.itemModalEdit.hide();
            })
        }
        $scope.submitAdd = function() {

            if (!$scope.newItem.fd) $scope.newItem.fd = new FormData();
            for (key in $scope.newItem) {
                if (key == "fd") continue;
                /*if (key == "house") {
				$scope.newItem.fd.append("house", $scope.newItem[key]._id)
				continue
			}*/
                $scope.newItem.fd.append(key, $scope.newItem[key])
            }
            console.log($scope.sizeArr, $scope.colorArr)
            $scope.sizeArr
            $scope.newItem.fd.append("sizeArr", JSON.stringify($scope.sizeArr).replace(/,"\$\$hashKey":"object:\d+"/g, ""))
            $scope.newItem.fd.append("colorArr", JSON.stringify($scope.colorArr).replace(/,"\$\$hashKey":"object:\d+"/g, ""))
            $http.post(Util.server + "/items", $scope.newItem.fd, {
                headers: {
                    'Content-Type': undefined
                },
            }).success(function(data) {
                if (data.code == "200") {
                    $ionicLoading.hide();
                    $scope.itemModalAdd.hide();
                    $scope.newItem = {};
                    $scope.getLatestCloth();
                }
            }).error(function(err) {

            })
            $ionicLoading.show({
                template: "正在提交"
            })
        }

        $scope.getLatestCloth = function() {
            Data.refreshCloth().then(function() {
                $scope.cloth = Data.allCloth();
                Data.refreshHouses().then(function() {
                    $scope.houses = Data.allHouses()
                    $scope.newItem.house = $scope.houses[0]
                    $scope.$broadcast('scroll.refreshComplete');
                })

            })
        }
        $scope.getLatestCloth();

        $scope.addFile = function(files) {
            if (!$scope.newItem.fd) $scope.newItem.fd = new FormData();
            $scope.newItem.fd.append("file", files[0]);
        };
    })
    .controller("ChartCtrl", function($scope, $http, Util) {
        $scope.amountData = []
        $scope.moneyData = []
        var data = {
            labels: [],
            datasets: [{
                label: "总数量",
                strokeColor: randomColor(),
                fillColor: "rgba(220,220,220,0.2)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }, {
                label: "总金额",
                strokeColor: randomColor(),
                fillColor: "rgba(151,187,205,0.2)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }]
        }
        $scope.refreshData = function() {
            $http.get(Util.server + "/chart/type").success(function(jsonData) {
                $scope.amountData = []
                $scope.moneyData = []
                $scope.labels = []
                data.datasets[0].data = []
                data.datasets[1].data = []
                var totalAmount = 0
                var totalMoney = 0
                jsonData.forEach(function(obj) {
                    totalAmount += obj.amount
                    totalMoney += obj.price * obj.amount
                    var tmp1 = {
                        label: obj.type,
                        value: obj.amount,
                        color: randomColor()
                    }
                    var tmp2 = {
                        label: obj.type,
                        value: obj.amount * obj.price,
                        color: randomColor()
                    }
                    $scope.amountData.push(tmp1)
                    $scope.moneyData.push(tmp2)
                    data.labels.push(obj.type)
                })
                jsonData.forEach(function(obj) {
                    data.datasets[0].data.push(Math.floor(obj.amount / totalAmount * 10000) / 100)
                    data.datasets[1].data.push(Math.floor(obj.amount * obj.price / totalMoney * 10000) / 100)
                })
                $scope.data = data
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
        $scope.refreshData()

        function randomColor() {
            return "#" + Math.floor(Math.random() * 16777215).toString(16)
        }
    })