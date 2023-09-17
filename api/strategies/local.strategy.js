const LocalStrategy = require('passport-local').Strategy
require('dotenv').config()



  const strategy = new LocalStrategy((username, password, done) => {
      User.findOne({ 'email': username })
          .then((user) => {
          if(!user) {
              return done(null, false, { message: 'Adresse E-mail introuvable.' });
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
              if(err) {
                  return done(err);
              }
              if(!isMatch) {
                  return done(null, false, { message: 'Mot de passe incorrect.' });
              }
              
             return done(null, user);
          })
      })
  })


module.exports = strategy