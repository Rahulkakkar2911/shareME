const fs = require('fs');
const File = require('../models/file');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

connectDB();

async function datafetch(){
    //previous day
    const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const files = await File.find({
        createdAt:{
            $lt: pastDate
        }
    });
    if(files.length){
        for(const file of files){
            try {
                //remove from storage
                fs.unlinkSync(file.path);
                //from db
                await file.deleteOne();
                console.log(`successfully deleted ${file.filename}`);
            
            } catch (error) {
                console.log(error);
            }
        }
    }
}
datafetch().then(()=>{
    console.log(`JOB DONE!`);
    process.exit();
})