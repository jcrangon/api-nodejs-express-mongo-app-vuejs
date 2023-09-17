const mongoose = require('mongoose');
require('dotenv').config();

// configuration de la connexion à la DB
mongoose.connect(process.env.DATABASE_URL);
 
// connexion à la DB
const database = mongoose.connection;

// ecouteur d'évènement 'error'
database.on('error', (error) => {
    console.log(error);
});

// ecouteur d'évènement 'coonnected'
database.once('connected', ()=>{
    console.log('Database connected'); 
})
 
module.exports=database
