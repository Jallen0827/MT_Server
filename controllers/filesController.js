//REQUIRED PACKAGES
const router = require('express').Router()
const multer = require('multer')
const stream = require('stream')
const path = require('path')
const multerS3 = require('multer-s3')
const fs = require('fs')
const AWS = require('aws-sdk')

//MODELS/MIDDLEWARE
const File = require('../db').import('../models/file')
const awsFile = require('../db').import('../models/awsFiles')
const User = require('../db').import('../models/user')
const validateSession = require('../middleware/validate-session')

//SETUP S3
let s3 = new AWS.S3({
    accessKeyId:  process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
})

//SETUP MULTER STORAGE LOCATION
let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ja-s3-aws-bucket',
        acl:'public-read-write',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})

// let storage = multer.memoryStorage()
// let upload = multer({storage:storage})

//UPLOAD SINGLE FILE/
router.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body)
    awsFile.create({
        location: req.file.location,
        title: req.body.title,
        owner_id: req.user.id
    })
        .then(successData => res.status(200).json({ successData }))
        .catch(err => {
            res.status(500).json({ error: err })
            console.log(err);
        })
});

//GET SINGLE FILE/
router.get('/awsFile/:id', (req, res) => {
    awsFile.findOne({
        where: {
            id: req.params.id,
        }
    }).then(foundImage => {
            res.status(200).json(foundImage);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})

//GET ALL FILES/
router.get('/all', (req,res)=>{
    awsFile.findAll()
    .then(files=>{
        res.status(200).json(files)
    })
    .catch(err=>{
        res.status(401).json({msg: err})
    })
})

//UPDATE FILE
router.put('/update/:id', upload.single('file'), (req,res)=>{
    console.log(req.body);
    awsFile.update({
        location: req.file.location,
        title: req.body.title,
        owner_id: req.user.id
    }, {where: {id: req.params.id}})
    .then(data =>{
        res.status(200).json({data})
    })
    .catch(err=>{
        res.status(500).send({msg: err})
    })
})

//DELETE FILE/
router.delete('/delete/:id', (req,res)=>{
    awsFile.destroy({where:{id:req.params.id}})
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).json({msg: err})
    })
})

//DOWNLOAD FILE
// router.get('/:id', (req,res)=>{
//     File.findByPk(req.params.id)
//     .then(file =>{
        
//         let fileContents = Buffer.from(file.data, 'base64')         
//         let readStream = new stream.PassThrough() 
//         readStream.end(fileContents)
        
//         res.set('Content-dispostion', 'attachment; filename='+file.name)
//         res.set('Content-Type', file.type) 

//         readStream.pipe(res)
//         // res.status(200).send(res)
//     }).catch(err=>{
//         res.status(401).json({msg: err})
//     })
// })

module.exports = router;