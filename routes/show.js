const express = require('express');
const { download } = require('express/lib/response');
const router = require('express').Router();
const File = require('../models/file');
router.use('/', express.static('public'));




router.get('/:uuid', async (req,res) => {
    try{
        const uuid = req.params.uuid;
        const file = await File.findOne({uuid});
        if(!file){
            // null is returned
            return res.status(404).render(`download`,{
                error: 'link has been expired.'
            })
        }
        res.render('download', {
            uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink:`${process.env.APP_BASE_URL}/files/download/${uuid}`
            //http://localhost:8000/files/download/fhahasgacba-abhadbacja
        })
    }catch(err){
        return res.render('download', {
            error: "Something Broke"
        });
    }
})


module.exports = router;