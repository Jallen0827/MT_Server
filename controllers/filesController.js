//REQUIRED PACKAGES
const router = require('express').Router()
const multer = require('multer')
const stream = require('stream')

//MODELS/MIDDLEWARE
const File = require('../db').import('../models/file')
const User = require('../db').import('../models/user')
const validateSession = require('../middleware/validate-session')

let storage = multer.memoryStorage()
let upload = multer({storage:storage})


File.belongsTo(User)
User.hasMany(File)

//UPLOAD SINGLE FILE
router.post('/upload', upload.single('file'), (req,res)=>{
    File.create({
        type: req.file.mimetype,
        name: req.file.originalname + Date.now(),
        data: req.file.buffer
    }).then(()=>{
        res.status(200).json({
            msg: `File ${req.file.originalname} uploaded successfully`
        })
    }).catch((err)=>{
        console.log(err)
        res.status(401).json({err: err})
    })
})

//GET ALL FILES (JUST ID AND NAME COLUMN RETURNED...)
router.get('/', (req,res)=>{
    File.findAll({attributes: ['id', 'name']})
    .then(files=>{
        res.status(200).json(files)
    })
    .catch(err=>{
        res.status(401).json({msg: err})
    })
})


router.get('/:id', (req,res)=>{
    File.findByPk(req.params.id)
    .then(file =>{
        let fileContents = Buffer.from(file.data, 'base64')
        let readStream = new stream.PassThrough()
        readStream.end(fileContents)

        res.set('Content-dispostion', 'attachment; filename='+file.name)
        res.set('Content-Type', file.type)

        readStream.pipe(res)
    }).catch(err=>{
        res.status(401).json({msg: err})
    })
})


module.exports = router;