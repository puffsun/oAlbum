
let mongoose = require('mongoose');
let config = require('./config.json');

function connect () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.dbURL, options).connection;
}

export default callback => {
    let db = connect()
        .on('error', console.log)
        .on('disconnected', connect);

    callback(db);
}
