var express = require("express")
var app = express()
var path = require("path")
var bodyParser = require('body-parser')
var multer = require('multer'); 
var mongoose = require("mongoose")
var localMongo = "mongodb://127.0.0.1:27017"
var remoteMongo = "mongodb://104.236.143.76:27017"
var db = mongoose.connect(localMongo)
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

app.use(bodyParser.json());
app.use(multer({dest: './img/'}))
app.use(express.static(__dirname));

app.get('/user', function(req, res){
	User.findOne({name: req.query.username}, function(err, user){
		if (!user) {
			console.log("Can't find user: %s", req.query.username)
			res.json(genResJson.notOk(400, "用户不存在"))
			return;
		}
		if (user.pwd == req.query.pwd) {
			console.log("A user Log-in validated.")
			res.json(genResJson.ok("200", user))
		} else {
			res.json(genResJson.notOk(400, "用户名/密码不匹配"))
		}
	})
	
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
.put("/user", function(req, res){
	console.log(req.body)
	User.update({_id: req.body._id}, req.body, {}, function(err){
		res.json(genResJson.ok())
	})
})
app.get('/items', function(req, res){
	Item.find({}, null, {sort: {date: -1}},  function(err, items){
		res.json(items)
	})
})
app.post('/items', function(req, res){
	var item = new Item(req.body)
	item.imageUrl = "/" + req.files.file.path.replace(/\\/, "/");
	item.save(function(err){
		if (err) res.json(genResJson.notOk())
		res.json(genResJson.ok())
	})
})
app.put('/items', function(req, res){
	Item.update({_id: req.body._id}, req.body, {}, function(err){
		res.json(genResJson.ok())
	})
})
app.delete('/items/:id', function(req, res){
	console.log(req.params)
	Item.find({_id: req.params.id}).remove(function(err){
		if (err) {
			res.json(genResJson.notOk(500, "Database Error:" + err))
			return;
		}
		console.log("An item deleted.")
		res.json(genResJson.ok())
	})
})

app.get('/orders', function(req, res){
	var condition = {};
	if (req.query.username) {
		condition.username = req.query.username;
	}
	Order.find(condition, null, {sort: {date: -1}}, function(err, orders){
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

app.put("/orders", function(req, res){
	console.log(req.body)
	if (Array.isArray(req.body)){
		console.log("Batch handling ORDER-PUT request.")
		req.body.foreach(function(obj){
			Order.update({_id: obj._id}, {done: obj.done})
		})
		res.json(genResJson.ok())
	} else {
		Order.update({_id: req.body._id}, {done: req.body.done}, {}, function(){
			res.json(genResJson.ok())
		})
	}
})

app.listen(3000, function(){
	console.log("listening on 3000")
})

var genResJson = {
	ok: function(code, data){
		return {code:200, data: data || ""}
	},
	notOk: function(code, data){
		return {code: code || 500, data: data || "Something's wrong"}
	}
}