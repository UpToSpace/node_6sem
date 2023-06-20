const credentials = require('./credentials.json')

exports.getUser = (user) => {
    return credentials.find((u) => u.username === user)
}

exports.validateUser = (user, password) => {
    const foundUser = this.getUser(user)
    if (foundUser) {
        return foundUser.password === password
    }
    return false
}
