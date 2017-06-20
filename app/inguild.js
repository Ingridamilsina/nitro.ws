const request = require('request')

module.exports = (req, res) => {

    let id = req.headers.guildid
    if (!id) return E(res)

    request({
        url: "http://localhost:2904/api/inguild",
        method: "POST",
        headers: {
            guildid: id
        }
    }, (err, result, body) => {
        if (err) return E(res)
        console.log(body)
        res.send(body)
    })

}

function E(res) {
    let errorObj = JSON.stringify({ error: true, msg: "Unauthorized" })
    return res.send(errorObj)
}