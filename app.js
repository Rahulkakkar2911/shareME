const express = require('express');
const downloadRouter = require('./routes/download');
const morgan = require('morgan');
const path = require('path');
const filesRouter = require('./routes/files');
const showRouter = require('./routes/show');
const app = express();
//Middlewares
//logging if -> Env -> dev
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use('/', express.static('public'));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
//Body parser

app.use(express.json());

//api
app.get('/', (req,res) => {
    res.render('index');
})
app.use('/files', showRouter);
app.use('/api/files', filesRouter);
app.use('/files/download', downloadRouter)

// Not found any matching ur ->
app.all("*",function(req,res,next){
    res.status(404).json({
        "status" : "failure",
        "data" : null
    });
})
//Exporting app to server
module.exports = app;