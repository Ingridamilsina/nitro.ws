const superagent = require('superagent')

module.exports = (req, res) => {

    let id = req.headers.guildid
    if (!id) return E(res)

    superagent.get('localhost:2904/api/inguild')
        .set({ guildid: id }).then(res => {
            console.log(res)
        })

}

function E(res) {
    let errorObj = JSON.stringify({ error: true, msg: "Unauthorized" })
    return res.send(errorObj)
}