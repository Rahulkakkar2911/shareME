const mongoose = require('mongoose');
function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>{
        console.log(`😊 DB Connection successfull`);
    }).catch(err => {
        console.log(`💣 DB Connection ERR -> ${err}`);
    });
}
module.exports = connectDB;