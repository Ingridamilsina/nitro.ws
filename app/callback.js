const superagent = require('superagent')

const { CLIENT } = require('../config')

module.exports = (req, res) => {
    let AUTH_URI = authURI()
    if (req.query.error) return res.redirect(AUTH_URI)
    if (!req.query.code) return res.redirect(AUTH_URI)

    let TOKEN_URI = tokenURI(req.query.code)
    superagent.post(TOKEN_URI).then((response) => {
        let enToken = (new Buffer(response.body.access_token)).toString('base64')
        res.cookie('nitroAccessToken', enToken, {maxAge: 518400000})
        res.redirect('http://nitro.ws/dashboard')
    }).catch()
    
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

function tokenURI(code) {

    const TOKEN_PARAMS = [
        'grant_type=authorization_code',
        `code=${code}`,
        `client_id=${CLIENT.ID}`,
        `client_secret=${CLIENT.SECRET}`,
        `redirect_uri=${CLIENT.REDIRECT_URI}`,
    ].join('&');

    return `https://discordapp.com/api/oauth2/token?${TOKEN_PARAMS}`
}