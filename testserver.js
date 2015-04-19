var express = require("express")
var bodyParser = require('body-parser')
var app = express();

app.use(bodyParser.json());
app.get("/", function(req, res){
	res.end("test")
})

app.post("/", function(req, res){
	console.log(req.body)
	res.json(req.body)
})

app.listen("3000")
console.log("3000")