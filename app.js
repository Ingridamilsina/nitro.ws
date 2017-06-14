const express = require("express");
const app = express();
const router = express.Router();
const path = __dirname + "/";
const port = 2001
const auth = require('./auth.js')
const r = require('rethinkdb')

top()

async function top() {

  let conn = await loadDB()

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

  //API
  router.use('/database', function (req, res) {
    if (req.method === "GET") {
      let returnObj = {
        error: true
      }
      let token = req.headers.authorization
      r.db('Nitro').table('config').filter({
        "data": {
          "apitoken": token
        }
      }).run(conn, (err, data) => {
        if (err) return res.send(JSON.stringify(returnObj))
        data.toArray((err, array) => {
          if (err) return res.send(JSON.stringify(returnObj))
          if (array.length < 1) res.send(JSON.stringify(returnObj))
          if (array.length === 1) res.send(JSON.stringify(array[0]))
          if (array.length > 1) res.send(JSON.stringify(returnObj))
        })
      })

    }
  })

  app.use("/", router);

  app.use("*", function (req, res) {
    res.sendFile(path + "404.html");
  });

  app.listen(app.get("port"), function () {
    console.log("Live at Port " + app.get("port"));
  });

}

async function loadDB() {

  let conn = await r.connect({
    host: "localhost",
    port: '28015',
    db: "Nitro",
    password: auth.rethink
  })
  return conn

}