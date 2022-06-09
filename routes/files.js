const express = require('express');
const multer = require('multer');
const router = require('express').Router();
const File = require('../models/file');
const {v4: uuid4} = require('uuid');
const path = require('path');
const sendMail = require('./../services/emailService');
const emailTemplate = require('./../utils/emailTemplate');

router.use('/', express.static('public'));
//multer config
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        //filename should be unique
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limit:{fileSize: 1000000 * 100},
}).single('myfile');

router.post('/' , (req,res) => {
    //store file in Uploads
    upload(req, res, async (err) => {
        //validation of request
        if(!req.file){
            return res.json({
                error: 'All fields are required'
            });
        }
        if(err){
            return res.status(500).send({error:err.message});
        }
        //store into db
        const file = new File({
            filename:req.file.filename,
            uuid: uuid4(),
            path:req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        return res.json({
            file:`${process.env.APP_BASE_URL}/files/${response.uuid}`
        });
        //http://localhost:8000/files/download/23241412314-434243241
    });
    //response -> link
})

router.post('/send', async (req, res) => {
    //validate;
    const {uuid, emailTo, emailFrom} = req.body;
    //get data from db
    const file = await File.findOne({uuid});
    //what if user send a email and then again click the button, think once!
    //email can be sent only once for a file.
    if(file.sender){
        res.status(401).send({
            error: "Email already sent!"
        });
    }
    //email not sent previously
    file.sender = emailFrom;
    file.reciever = emailTo;
    const response = await file.save();

    //send email
    sendMail({
        from : emailFrom,
        to: emailTo,
        subject : "ShareMe File Share",
        text: `${emailFrom} shared a file with you.`,
        html: emailTemplate({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + " KB",
            expires: `24 hours`
         })
    });
    res.send({
        success: true
    });
});

module.exports = router;