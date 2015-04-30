angular.module('starter.services', [])

.factory('Data', function($http, Util) {
    var cloth = [];
    var orders = [];
    var houses = [];
    var materialMap = {
        "纯棉": "M",
        "牛津布": "N",
        "雪纺": "X",
        "纯麻": "C",
        "真丝": "Z"
    }

    var typeMap = {
        "大衣": "DY",
        "上衣": "SY",
        "裤子": "KZ",
        "裙子": "QZ",
        "内衣": "NY"
    }


    var sizeArr = [{
        name: "S",
        checked: false
    }, {
        name: "M",
        checked: false
    }, {
        name: "L",
        checked: false
    }, {
        name: "XL",
        checked: false
    }, {
        name: "XXL",
        checked: false
    }]
    var colorArr = [{
        name: "RED",
        checked: false,
        class: "assertive"
    }, {
        name: "BLACK",
        checked: false,
        class: "dark"
    }, {
        name: "PURPLE",
        checked: false,
        class: "royal"
    }, {
        name: "GREEN",
        checked: false,
        class: "balanced"
    }, {
        name: "BLUE",
        checked: false,
        class: "positive"
    }]

    return {
        allOrders: function() {
            return orders;
        },
        refreshOrders: function() {
            return $http.get(Util.server + "/orders").success(function(data) {
                orders = data;
            })
        },
        allCloth: function() {
            return cloth;
        },
        refreshCloth: function() {
            return $http.get(Util.server + "/items").success(function(data) {
                cloth = data;
            })
        },
        allHouses: function() {
            return houses;
        },
        refreshHouses: function() {
            return $http.get(Util.server + "/houses").success(function(data) {
                houses = data;
            })
        },
        typeMap: typeMap,
        materialMap: materialMap,
        sizeArr: sizeArr,
        colorArr: colorArr
    };
})

.factory('Util', function() {
    var localServer = "http://127.0.0.1:3000"
    var remoteServer = "http://104.236.143.76:3000"
    return {
        server: localServer,
        genImgUrl: function(path) {
            return this.server + path;
        }
    }
})