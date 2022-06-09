const mongoose = require('mongoose');
function connectDB(mongoString = process.env.MONGO_CONNECTION_URL){
    mongoose.connect(mongoString).then(()=>{
        console.log(`😊 DB Connection successfull`);
    }).catch(err => {
        console.log(`💣 DB Connection ERR -> ${err}`);
    });
}
module.exports = connectDB;