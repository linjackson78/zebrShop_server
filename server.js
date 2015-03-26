var express = require("express")
var app = express()
var bodyParser = require('body-parser')
var mongoose = require("mongoose")
var db = mongoose.connect("mongodb://104.236.143.76:27017")
var ObjectId = mongoose.Schema.Types.ObjectId;
var schema = mongoose.Schema
var itemSchema = new schema({
	id: ObjectId,
	type: String,
	brand: String,
	inventory: Number,
	date: { 
		type: Date, default: Date.now
	},
	sales: {
		type: Number,
		default: 0
	},
	price: Number,
	imageUrl: String
})

var orderSchema = new schema({
	id: ObjectId,
	username: String,
	date: {
		type: Date,
		default: Date.now 
	},
	total: Number,
	itemArr: [{
		itemId: { type: ObjectId, ref: 'Item' },
		amount: Number,
	}],
	done: {
		type: Boolean,
		default: false
	}
})

var userSchema = new schema({
	id: ObjectId,
	name: {
		type: String,
		unique: true,
		required: true,
	},
	pwd: String,
	personInfo: {
		address: String,
		phone: String,
		recieverName: String,
	},
	orders: [orderSchema]
})

var Item = mongoose.model("Item", itemSchema)
var User = mongoose.model("User", userSchema)
var Order = mongoose.model("Order", orderSchema)

/*var item = new Item();
item.type = "t-shirt";
item.brand = "H&M";
item.price = 200;
item.imageUrl = "/img/pants.jpg";
item.inventory = 200;
item.save(function(err){
	console.log(err)
})*/

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.get('/user', function(req, res){
	var user = User.findOne({name: req.username})
	if (!user) {
		console.log("Can't find user: %s", req.body.username)
		res.json(genResJson.notOk(400, "User not exist."))
		return;
	}

	if (user.name == req.body.username) {
		console.log("A user Log-in validated.")
		res.json(genResJson.ok())
	} else {
		res.json(genResJson.notOk(400, "Username/password not match."))
	}
});

app.post("/user", function(req, res){
	var query = User.findOne({name: req.body.username})
	if (query) {
		res.json(genResJson.notOk(null, "Username already exist."))
		return;
	}
	var user = new User();
	user.name = req.body.username;
	user.pwd = req.body.password;
	user.save(function(err){
		if (err) {
			console.log(err)
			res.json(genResJson.notOk(null, err))
			return;
		}
		console.log("New user added.")
		res.json(genResJson.ok())
	})
})

app.get('/items', function(req, res){
	Item.find({}, function(err, items){
		res.json(items)
	})
})

app.get('/orders', function(req, res){
	var condition = {};
	if (req.query.username) {
		condition.username = req.query.username;
	}
	Order.find(condition, function(err, orders){
		res.json(orders)
	})
})
app.post("/orders", function(req, res){
	var order = new Order(req.body);
	order.save(function(err){
		if (err){
			res.json(genResJson.notOk(500, "Database Error:" + err))
			return;
		}
		res.json(genResJson.ok())
	})
})
app.delete("/orders/:id", function(req, res){
	Order.find({_id: req.params.id}).remove(function(err){
		if (err) {
			res.json(genResJson.notOk(500, "Database Error:" + err))
			return;
		}
		console.log("An order deleted.")
		res.json(genResJson.ok())
	})
})

app.listen(3000, function(){
	console.log("listening on 3000")
})

var genResJson = {
	ok: function(msg){
		return {code:200, msg: msg || ""}
	},
	notOk: function(code, data){
		return {code: code || 500, data: data || "Something's wrong"}
	}
}