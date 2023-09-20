const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user.model')
require('dotenv').config()

// config de JwtOptions
const JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
}


const strategy = new JwtStrategy(JwtOptions, (payload, done) => {
    console.log(payload);
    User.findById(payload.sub)
    .then((user) => {
        
        if(!user) {
            return done(null, false, { message: 'utilisateur introuvable...' })
        }
        return done(null, user);
    })
})


module.exports = strategy