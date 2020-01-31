//REQUIRED PACKAGES
const router = require('express').Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const AWS = require('aws-sdk')

//MODELS/MIDDLEWARE
const awsFile = require('../db').import('../models/videos')
const Person = require('../db').import('../models/person')
const Comments = require('../db').import('../models/comments')
const validateSession = require('../middleware/validate-session');

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

//GET ALL VIDEO TITLES
router.get('/titles', (req,res)=>{    
        awsFile.findAll({
            attributes: ['title']
          })
        .then(files=>{
            res.status(200).json(files)
        })
        .catch(err=>{
            res.status(401).json({msg: err})
        })
    
})

//UPLOAD ARRAY OF FILES//
router.post('/upload', validateSession, upload.array('file', 12), (req, res) => {
    console.log(req.body)
    console.log(req.files)
    let filesArr = req.files
    let rowArr = []
    for (let i = 0; i < filesArr.length; i++){
        rowArr.push({ 
            location: filesArr[i].location,
            title : filesArr[i].originalname,
            owner_id: req.user.id
        })
    }

    awsFile.bulkCreate(rowArr, {returning: true})
        .then(successData => res.status(200).json({ successData }))
        .catch(err => {
            res.status(500).json({ error: err })
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

//GET ALL BY PERSON ID
router.get('/all/:id', (req,res)=>{
    awsFile.findAll({where: {personId: req.params.id}})
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).send({msg:err})
    })
})

//UPDATE FILE
router.put('/update/:id', validateSession, (req,res)=>{
    awsFile.update({
        title: req.body.title
    }, {where: {id: req.params.id}})
    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).send({msg: err})
    })
})

//DELETE FILE/
router.delete('/delete/:id', validateSession, (req,res)=>{
    awsFile.destroy({where:{id:req.params.id}})
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).json({msg: err})
    })
})

module.exports = router;