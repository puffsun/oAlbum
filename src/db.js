
let mongoose = require('mongoose');
let config = require('./config.json');

export default callback => {
    mongoose.connect(config.mongodbURL);
    //Get the default connection
    let db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    callback(db);
}
