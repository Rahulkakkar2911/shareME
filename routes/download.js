const express = require('express');
const File = require('../models/file');
const router = express.Router();


router.use('/', express.static('public'));
router.get('/:uuid',async (req, res) => {
    const uuid = req.params.uuid;
    const file = await File.findOne({uuid});
    if(!file){
        //file is null
        return res.render('download', {
            error: "Link has been Expired",
            title: "Expired Link"
        });
    }
    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
});

module.exports = router;