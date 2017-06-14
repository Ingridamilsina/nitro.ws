const express = require("express");
const app = express();
const router = express.Router();
const path = __dirname + "/";
const port = 2001
const auth = require('./auth.js')
const r = require('rethinkdb')



app.use(express.static('public'))

app.set("port", port)

router.use(function (req, res, next) {
  console.log(req.url);
  next();
});

router.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

router.get("/dashboard", function (req, res) {
  res.sendFile(path + "dashboard.html");
});

app.use("/", router);

app.use("*", function (req, res) {
  res.sendFile(path + "404.html");
});

//Api
app.use('/api/1/database', function (req, res) {
  if (req.method === "GET") {

  }
  if (req.method === "POST") {

  }
})

app.listen(app.get("port"), function () {
  console.log("Live at Port " + app.get("port"));
});

function loadDB() {

  return new Promise((resolve, reject) => {

    r.connect({
      host: "localhost",
      port: '28015',
      db: "Nitro",
      password: auth.rethink
    }).run(conn => {

    })

  })

}