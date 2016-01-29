var mongoose = require('mongoose');
var env = require('./environment');
// Use different database URIs based on whether an env var exists.
var dbUri = env.MONGOLAB_URI ||
            'mongodb://localhost/' + env.SAFE_TITLE;


// change dburi to below for heroku
// var dbUri = env.MONGOLAB_URI ||
//             'mongodb://heroku_srlhp1qr:lo08kfplt2s4llorku6a506of@ds051615.mongolab.com:51615/heroku_srlhp1qr' + env.SAFE_TITLE;

if (!env.MONGOLAB_URI) {
  // check that MongoD is running...
  require('net').connect(27017, 'localhost').on('error', function() {
    console.log("YOU MUST BOW BEFORE THE MONGOD FIRST, MORTAL!");
    process.exit(0);
  });
}
mongoose.connect(dbUri);
module.exports = mongoose;
