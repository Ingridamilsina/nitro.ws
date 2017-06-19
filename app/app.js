//Modules
const express = require("express")
const cookieParser = require('cookie-parser')

//Config
const config = require('../config')
config.init()
module.exports = {
    TOKEN: config.AUTH.TOKEN,
    SECRET: config.AUTH.SECRET
}

//Files
const database = require('./database')
const callback = require('./callback')
const login = require('./login')
const authorize = require('./authorize')
const userinfo = require('./userinfo')

//Create Express App
const app = express();
const router = express.Router()
let path = __dirname.split('/')
path.pop()
path = path.join('/') + "/views/"
const port = process.env.PORT || 80

async function init() {

    await database.init()

}

(async function startServer() {

    await init()

    //Put Files In Static
    app.use(express.static('public'))

    //Cookie
    app.use(cookieParser())


    router.use(function(req, res, next) {
        console.log(req.url);
        next();
    });

    //Website
    router.get("/", function(req, res) {
        res.sendFile(path + "index.html");
    });

    router.get("/commands", (req, res) => {

    })

    router.get("/dashboard", (req, res) => {
        res.sendFile(path + "dashboard.html");
    });

    //API
    router.use('/api/authorize', (req, res) => {
        authorize(req, res)
    })

    router.use('/api/login', (req, res) => {
        login(req, res)
    })

    router.use('/api/callback', (req, res) => {
        callback(req, res)
    })

    router.use('/api/database', (req, res) => {
        database(req, res)
    })

    router.use('/api/userinfo', (req, res) => {
       userinfo(req, res)
    })

    app.use("/", router);

    //404
    app.use("*", (req, res) => {
        res.sendFile(path + "404.html");
    });

    app.listen(port, () => {
        console.log("Live at Port " + port);
    });

})()