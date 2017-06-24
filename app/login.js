const { CLIENT } = require('../config')
const { TOKEN, SECRET } = require('./app')

module.exports = (req, res) => {
    let auth = req.headers.authorization
    if (!auth) return E(res)
    let token = auth.split(" ") 
    if (token[0] !== "Basic") return E(res)
    token = token[1]
    let decode = (new Buffer(token, 'base64')).toString().split(":")
    if (decode[0] !== TOKEN) return E(res)
    if (decode[1] !== SECRET) return E(res)
    var AUTH_URI = authURI()
    let obj = JSON.stringify({ url: AUTH_URI })
    res.send(obj)

}

function E(res) { 
    let errorObj = JSON.stringify({
        error: true,
        msg: "Unauthorized"
    })
    return res.send(errorObj)
}

function authURI() {

    const AUTH_QUERY = [
        `client_id=${CLIENT.ID}`,
        `scope=${CLIENT.SCOPES.join('+')}`,
        `redirect_uri=${CLIENT.REDIRECT_URI}`,
        'response_type=code',
    ].join('&');

    return `https://discordapp.com/oauth2/authorize?${AUTH_QUERY}`;

}