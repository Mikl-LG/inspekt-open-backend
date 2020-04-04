const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    accessKeyId:'AKIA5JIBCZYIY4IZPEFL',
    secretAccessKey: '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',
    region:'eu-west-3'
})

const s3 = new aws.S3();
const upload = multer({
    storage:multerS3({
        s3,
        bucket:'/inspekt_open/media',
        contentType:multerS3.AUTO_CONTENT_TYPE,
        acl:'public-read',
        metadata:function(req,file,callback){callback(null,{fieldName:file.fieldname})},
        key:function(req,file,callback){callback(null,'inspekt_'+Date.now())},
    })
});

app.use((req,res,next)=>{
    if(req.originalUrl === '/favicon.ico'){
        res.status(204).json({nope:true});
    }else{
        next();
    }
})

/// enable CORS ///
app.use((req, res, next) => {
    /* /!\ RAT : allow-origin : restrict to remote and same-origin before production */
    res.header('Access-Control-Allow-Origin', "*"); 


    res.header('Access-Control-Allow-Headers', "Content-Type, X-Requested-With, Origin, Accept");
    next()
})

app.use(bodyParser.urlencoded({
    parameterlimit:100000,
    limit:'50Mb',
    extended:true
}))

app.get('/',(req,res)=>{
    res.status(403).send('FORBIDDEN');
})

app.post('/upload',upload.array('filedata'),function(req,res){
    console.log('reqfiles : ',req.files);
})

app.all('*', (req, res) => {
    res.status(404).send('PAGE NOT FOUND')
})

app.listen(process.env.PORT || 3000,function(){
    console.log('OK')
})