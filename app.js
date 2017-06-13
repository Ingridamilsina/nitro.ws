var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + "/";

app.use(express.static('public'))

router.use(function (req,res,next) {
  console.log(req.url);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(80,function(){
  console.log("Live at Port 80");
});