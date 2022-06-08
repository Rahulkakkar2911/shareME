const app = require('./app');
const Bree = require('bree');
const dotenv = require('dotenv')
const db = require('./config/db');
const mongoose = require('mongoose');
dotenv.config({
    path:'./config.env'
});

const PORT = process.env.PORT;

//DataBase connection
db();
const bree = new Bree({
    jobs:[{
        name: 'deletion',
        interval:"at 02:00 am",
        // timeout:''
    }]
});

bree.start();

const server = app.listen(PORT, (err) => {
    if(err){
        console.log(`❌ Error Occured`,err);
        return;
    }
    console.log(`🔁 ShareMe App is running on port: ${PORT}`);
})