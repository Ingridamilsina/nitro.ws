const r = require('rethinkdb')

const { PASS } = require('../config').RETHINK
const { SECRET, TOKEN } = require('./app')

let conn

module.exports = (req, res) => {

    if (req.method === "GET") GET(req, res)
    else if (req.method === "POST") POST(req, res)

}

let GET = (req, res) => {

    let token = req.headers.authorization

    if (!token) return E(res)
    let split = token.split(" ")
    if (split[0] !== "Basic") return E(res)
    let decode = (new Buffer(split[1], 'base64')).toString()
    decode = decode.split(":")

    if (decode[0] !== TOKEN) return E(res)
    if (decode[1] !== SECRET) return E(res)
    if (!decode[2]) return E(res)

    let id = decode[2]

    r.db('Nitro').table('config').get(id).run(conn, (err, data) => {
        if (err) return E(res)

        let obj
        if (data) {
            obj = data.data
        } else {
            obj = {}
        }

        return res.send(JSON.stringify(obj))
    })
}

let POST = (req, res) => {

    let token = req.headers.authorization

    if (!token) return E(res)
    let split = token.split(" ")
    if (split[0] !== "Basic") return E(res)
    let decode = (new Buffer(split[1], 'base64')).toString()
    decode = decode.split(":")

    if (decode[0] !== TOKEN) return E(res)
    if (decode[1] !== SECRET) return E(res)
    if (!decode[2]) return E(res)

    let id = decode[2]

    r.table('config').insert({
        id,
        data: JSON.parse(req.headers.data)
    }, {
        conflict: "update"
    }).run(conn, (err, data) => {
        if (err) return E(res)

    })

}

module.exports.init = async() => {

    conn = await r.connect({
        host: "localhost",
        port: '28015',
        db: "Nitro",
        password: PASS
    })
    return

}

function E(res) {
    let errorObj = JSON.stringify({ error: true, msg: "Unauthorized" })
    return res.send(errorObj)
}