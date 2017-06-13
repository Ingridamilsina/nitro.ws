var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + "/";
let port = 2001

app.use(express.static('public'))

app.set("port", port)

router.use(function (req, res, next) {
  console.log(req.url);
  next(); 
});

router.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

app.use("/", router);

app.use("*", function (req, res) {
  res.sendFile(path + "404.html");
});

app.listen(app.get("port"), function () {
  console.log("Live at Port " + app.get("port"));
}); 