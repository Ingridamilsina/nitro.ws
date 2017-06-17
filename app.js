const express = require("express");
const superagent = require('superagent');
const app = express();
const router = express.Router();
const path = __dirname + "/";
const port = process.env.PORT || 80
const {RETHINK_PASS, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, CLIENT_SCOPES} = require('./auth.js')
const r = require('rethinkdb')

const AUTH_QUERY = [
  `client_id=${CLIENT_ID}`,
  `scope=${CLIENT_SCOPES.join('+')}`,
  `redirect_uri=${REDIRECT_URI}`,
  'response_type=code',
].join('&');

const AUTH_URI = `https://discordapp.com/oauth2/authorize?${AUTH_QUERY}`;

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
  router.use('/api/database', function (req, res) {
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
          if (array.length === 1) res.send(JSON.stringify(array[0].data))
          if (array.length > 1) res.send(JSON.stringify(returnObj))
        })
      })

    } else if (req.method === "POST") {
      let returnObj = {
        error: true
      }
      let token = req.headers.authorization
      r.table('config').filter({
        "data": {
          "apitoken": token
        }
      }).run(conn, (err, data) => {
        if (err) return res.send(JSON.stringify(returnObj))
        data.toArray((err, array) => {
          if (err) return res.send(JSON.stringify(returnObj))
          if (array.length < 1) return res.send(JSON.stringify(returnObj))
          if (array.length === 1) {
            r.table('config').insert({
              id: array[0].id,
              data: JSON.parse(req.headers.data)
            }, {
              conflict: "update"
            }).run(conn, (err, data) => {
              if (err) return res.send(JSON.stringify(returnObj))
              res.send(JSON.stringify({
                error: false
              }))
            })
          }
          if (array.length > 1) return res.send(JSON.stringify(returnObj))
        })
      })
    }
  })

  router.use('/api/login', (req, res) => {
    res.redirect(AUTH_URI)
  })

  router.use('/api/callback', (req, res) => {
    if (req.query.error) return res.redirect(AUTH_URI)
    if (!req.query.code) return res.redirect(AUTH_URI)
    res.redirect("http://nitro.ws/dashboard")
    console.log(req.query.code)
    const TOKEN_PARAMS = [
      'grant_type=authorization_code',
      `code=${req.query.code}`,
      `client_id=${CLIENT_ID}`,
      `client_secret=${CLIENT_SECRET}`,
      `redirect_uri=${REDIRECT_URI}`,
    ].join('&');
    const TOKEN_URI = `https://discordapp.com/api/oauth2/token?${TOKEN_PARAMS}`;
    console.log(TOKEN_URI)
    superagent.post(TOKEN_URI).then((response) => {
      superagent.get('https://discordapp.com/api/users/@me')
      .set({Authorization: `${response.body.token_type} ${response.body.access_token}`})
      .then(r => r.body)
    }).then(user => {
      console.log(user)
    }).catch(console.log)
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
    password: RETHINK_PASS
  })
  return conn

}