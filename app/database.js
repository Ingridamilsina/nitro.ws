const r = require('rethinkdb')

const {
    PASS
} = require('../config').RETHINK

let conn

module.exports = (req, res) => {

    if (req.method === "GET") GET(req, res)
    else if (req.method === "POST") POST(req, res)

}

let GET = (req, res) => {

    let token = req.headers.authorization
    let id = req.headers.server_id
    r.db('Nitro').table('config').get({
        id
    }).run(conn, (err, data) => {
        let errorObj = JSON.stringify({ error: true })
        if (err) return res.send(errorOrbj)
        data.toArray((err, array) => {
            if (err) return res.send(errorObj)
            if (array.length < 1) res.send(errorObj)
            if (array.length === 1) res.send(errorObj)
            if (array.length > 1) res.send(errorObj)
        })
    })
}

let POST = (req, res) => {
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