const { TOKEN, SECRET } = require('./app')

module.exports = (token, id) => {

    let buffer = new Buffer(token, "base64")
    let decode = buffer.toStrine()
    let part = decode.split(":")
    if (part[0] !== TOKEN) return false
    if (part[1] !== SECRET) return false
    if (part[2] !== id) return false
    return true

}