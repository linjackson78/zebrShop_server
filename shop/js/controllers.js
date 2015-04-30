angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout, $ionicSideMenuDelegate, $ionicPopup) {
    var localServer = "http://127.0.0.1:3000"
    var remoteServer = "http://104.236.143.76:3000"
    $scope.server = localServer;
    $scope.cart = [];
    $scope.orders = [];
    $scope.houses = [];
    $scope.curHouse = "所有会场"
    $scope.curType = "所有分类"
    $scope.curItem = {}
    $scope.lists = [];
    $scope.refreshCloth = function() {
        $http.get($scope.server + "/items")
            .success(function(data) {
                $scope.lists = data
                $scope.$broadcast('scroll.refreshComplete');
            })
    }

    $scope.refreshHouses = function() {
        $http.get($scope.server + "/houses")
            .success(function(data) {
                var now = new Date()
                $scope.houses = []
                data.forEach(function(obj) {
                    var start = new Date(obj.start)
                    var end = new Date(obj.end)
                    if (start < now && end > now) {
                        $scope.houses.push(obj)
                    }
                })
            })
    }
    $scope.refreshCloth();
    $scope.refreshHouses();

    $scope.changeCurHouse = function(house) {
        $scope.curHouse = house
    }

    $scope.genImgUrl = function(path) {
        return $scope.server + path
    }
    $scope.changeType = function(type) {
        $scope.curType = type;
        $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.onTypeChange = function(curType) {
        $scope.curType = curType
        $ionicSideMenuDelegate.toggleLeft();
    }
    $scope.onHouseChange = function(curHouse) {
        $scope.curHouse = curHouse
        if (curHouse != "所有会场") {
            $scope.houses.forEach(function(obj) {
                if (obj._id == curHouse) {
                    $scope.curHouseObj = obj
                }
            })
        }
    }
    $scope.data = {
        number: 1,
    };
    $scope.user = {
        "_id": "551383808492a7902d2b5fe5",
        "pwd": "zebr",
        "name": "zebr",
        "__v": 0,
        "orders": [],
        isLogin: true,
        personInfo: {}
    }
    $scope.total = function() {
        var result = 0;
        $scope.cart.forEach(function(obj) {
            result += obj.price * obj.numInCart;
        })
        return result;
    }
    $scope.sort = function(salesOrder) {
        if (!$scope.lists) return;
        $ionicSideMenuDelegate.toggleLeft();
        $scope.lists.sort(function(a, b) {
            if ((a.sales - b.sales) > 0) {
                return salesOrder
            } else {
                return -1 * salesOrder
            }
        })
    }
    $scope.filterByHouse = function(item) {
        return ($scope.curHouse == "所有会场") ? true : (item.house == $scope.curHouse)
    }
    $ionicModal.fromTemplateUrl('templates/cart.html', {
        id: "cart",
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.cartModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/login.html', {
        id: "login",
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.loginModal = modal;
    });

    $ionicModal.fromTemplateUrl('templates/addItem.html', {
        id: "add",
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.addModal = modal;
    });
    $ionicModal.fromTemplateUrl('templates/editUser.html', {
        id: "editUser",
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.editUserModal = modal;
    });

    $scope.showCart = function() {
        $scope.cartModal.show();
    }

    $scope.hideCart = function() {
        $scope.cartModal.hide();
    }

    $scope.loginData = {}

    $scope.showLogin = function() {
        $scope.loginModal.show();
    }

    $scope.hideLogin = function() {
        $scope.loginModal.hide();
    }

    $scope.logout = function() {
        $scope.user = [];
        $scope.loginData = {}
    }

    $scope.putUser = function() {
        if ($scope.user.newPwd && !$scope.user.newPwd.match(/^[0-9A-Za-z]{6,10}$/)) {
            $ionicPopup.alert({
                title: "密码不合法",
                template: "密码必须由6至10位数字与字母组成，目前不允许其它符号",
                okText: "明白了",
                okType: "button-assertive"
            })
            return;
        }
        $http.put($scope.server + "/user", $scope.user).success(function(data) {
            if (data.code !== 200) {
                $ionicPopup.alert({
                    title: "出错了",
                    template: data.data
                })

            } else {
                $ionicPopup.alert({
                    title: "个人信息修改成功"
                })
            }
        })
    }

    $scope.doValidate = function() {
        if ($scope.loginData.username && !$scope.loginData.username.match(/^[0-9A-Za-z_@-]{3,10}$/)) {
            $ionicPopup.alert({
                title: "用户名不合法",
                template: "用户名必须3至10位由数字与字母组成，目前允许的符号只有“_-@”",
                okText: "明白了",
                okType: "button-assertive"
            })
            return;
        } else if ($scope.loginData.pwd && !$scope.loginData.pwd.match(/^[0-9A-Za-z]{6,10}$/)) {
            $ionicPopup.alert({
                title: "密码不合法",
                template: "密码必须由6至10位数字与字母组成，目前不允许其它符号",
                okText: "明白了",
                okType: "button-assertive"
            })
            return;
        }
        if ($scope.loginData.isSign) {
            if ($scope.loginData.pwd != $scope.loginData.repeatPassword) {
                return
            }
            $http.post($scope.server + "/user", $scope.loginData)
                .success(function(data) {
                    if (data.code == 200) {
                        $scope.hideLogin();
                        $scope.user.name = $scope.loginData.username
                        $scope.loginData = {}
                        $scope.user.isLogin = true;
                        console.log($scope.user)
                    } else {
                        $ionicPopup.alert({
                            title: "出错了",
                            template: data.data
                        })
                    }
                })
        } else {
            $http.get($scope.server + "/user?username=" + $scope.loginData.username + "&pwd=" + $scope.loginData.pwd)
                .success(function(data) {
                    if (data.code == 200) {
                        $scope.hideLogin();
                        $scope.user = data.data;
                        $scope.user.isLogin = true;
                    } else {
                        $ionicPopup.alert({
                            title: "出错了",
                            template: data.data
                        })
                    }
                })
        }
    }

    $scope.toggleLogSign = function() {
        $scope.loginData.isSign = $scope.loginData.isSign ? false : true;
    }

    $scope.add2Cart = function(item, e) {
        $scope.curItem = item
        $scope.addModal.show()
    }

    $scope.confirmAdd = function() {
        var hasInCart = false;
        $scope.cart.forEach(function(obj, index) {
            if (obj._id == $scope.curItem._id) {
                $scope.cart.splice(index, 1)
                hasInCart = true;
            }
        })
        $scope.cart.push($scope.curItem);
        $ionicPopup.alert({
            title: "已经添加到购物车"
        }).then(function() {
            $scope.addModal.hide()
        })
    }

    $scope.$on('$destroy', function() {
        $scope.cartModal.remove();
        $scope.loginModal.remove();
        $scope.ordersModal.remove();
        console.log("on destroy")
    });

})

.controller('user', function($scope, $http, $ionicModal, $ionicLoading, $timeout, $ionicPopup, $stateParams) {
        $ionicModal.fromTemplateUrl('templates/submit.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.refreshOrders = function() {
            return $http.get($scope.server + "/orders?username=" + $scope.user.name)
                .success(function(data) {
                    $scope.orders = data;
                })
        }
        if (!$scope.curOrder) {
            $scope.refreshOrders().then(function() {
                if ($stateParams.index !== undefined) {
                    $scope.curOrder = $scope.orders[$stateParams.index]
                }
            })
        }
        $scope.doSubmit = function() {
            if (!$scope.cart[0]) {
                $ionicPopup.alert({
                    title: "购物车啥都没"
                })
                return;
            }
            if (!$scope.user.isLogin) {
                $ionicPopup.confirm({
                    title: "用户未登录",
                    buttons: [{
                        text: '不想登录'
                    }, {
                        text: '<b>登录</b>',
                        type: 'button-positive',
                        onTap: function() {
                            return true;
                        }
                    }]
                }).then(function(res) {
                    if (res) {
                        $scope.loginModal.show();
                        $scope.cartModal.hide();
                    } else {}
                })
            } else {
                $scope.modal.show();
            }

        }
        $scope.cancelSubmit = function() {
            $scope.modal.hide();
        }
        $scope.submit = function() {
            var info = $scope.user.personInfo;
            if (!(info.address && info.phone && info.recieverName)) {
                $ionicPopup.alert({
                    title: "收货信息必须填完整的说",
                })
                return;
            }
            $ionicLoading.show({
                template: "正在提交..."
            });
            var user = {
                _id: $scope.user._id,
                personInfo: {
                    address: info.address,
                    phone: info.phone,
                    recieverName: info.recieverName
                }
            }
            var order = {
                username: $scope.user.name,
                itemArr: [],
                total: $scope.total(),
                personInfo: user.personInfo
            }
            $scope.cart.forEach(function(obj) {
                var tmp = {};
                tmp.itemId = obj._id
                tmp.amount = obj.numInCart;
                tmp.color = obj.color;
                tmp.size = obj.size
                order.itemArr.push(tmp)
            })
            $http.post($scope.server + "/orders", order)
                .success(function(data) {
                    if (data.code == "200") {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                                title: '提交成功',
                            })
                            .then(function(res) {
                                $scope.$parent.$parent.$parent.cart = [];
                                $scope.cancelSubmit();
                            });
                    }
                })

            $http.put($scope.server + "/user", user)
                .success(function(data) {})

        }
    })
    .filter('unique', function() {

        return function(items, filterOn) {

            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var hashCheck = {},
                    newItems = [];

                var extractValueToCompare = function(item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };

                angular.forEach(items, function(item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }

                });
                items = newItems;
            }
            return items;
        };
    })
