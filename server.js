const app = require('./app');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config({
    path:'./config.env'
});
const PORT = process.env.PORT;
//DataBase
mongoose.connect(process.env.MONGO_CONNECTION_URL).then(()=>{
    console.log(`😊 DB Connection successfull`);
}).catch(err => {
    console.log(`💣 DB Connection ERR -> ${err}`);
});

const server = app.listen(PORT, (err) => {
    if(err){
        console.log(`❌ Error Occured`,err);
        return;
    }
    console.log(`🔁 ShareMe App is running on port: ${PORT}`);
})