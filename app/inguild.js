const request = require('request')

module.exports = (req, res) => {

    let id = req.headers.guildid
    if (!id) return E(res)

    request({
        url: "localhost:2904/api/inguild",
        headers: {
            guildid: id
        }
    }, (err, result, body) => {
        if (err) return console.log(err)
        console.log(body)
    })

}

function E(res) {
    let errorObj = JSON.stringify({ error: true, msg: "Unauthorized" })
    return res.send(errorObj)
}