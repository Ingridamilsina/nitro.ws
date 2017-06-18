const { DEFAULT } = require('../config').AUTH
const { TOKEN, SECRET } = require('./app')

module.exports = (req, res) => {

    let auth = req.headers.authorization
    if (!auth) return E(res)
    let split = auth.split(" ")
    let encoded = split[1]
    if (split[0] !== "Basic") return E(res)
    let decode = (new Buffer(encoded, "base64")).toString()
    if (decode !== DEFAULT) return E(res)
    let creds = (new Buffer(TOKEN + ":" + SECRET)).toString("base64")
    return res.send(JSON.stringify({ auth: creds }))

}

function E(res) {
    let errorObj = JSON.stringify({ error: true, msg: "Unauthorized" })
    return res.send(errorObj)
}