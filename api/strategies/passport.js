const passport = require('passport')
const localStrategy = require('../strategies/local.strategy')
const jwtStrategy = require('../strategies/jwt.strategy')
// configuration de passport
passport.use(localStrategy)
passport.use(jwtStrategy)

module.exports = passport