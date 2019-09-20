//REQUIRED PACKAGES
const router = require('express').Router()
const multer = require('multer')
const stream = require('stream')
const path = require('path')

//MODELS/MIDDLEWARE
const File = require('../db').import('../models/file')
const User = require('../db').import('../models/user')
const validateSession = require('../middleware/validate-session')

let storage = multer.memoryStorage()
let upload = multer({storage:storage})

//UPLOAD SINGLE FILE
router.post('/upload', upload.single('file'), (req,res)=>{
    console.log(req.body);
    File.create({
        type: req.file.mimetype,
        title: req.body.name,
        name: req.file.originalname,
        data: req.file.buffer,
        ownerId: req.user.id
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
router.get('/all', (req,res)=>{
    File.findAll({attributes: ['id', 'name', 'title', 'data']})
    .then(files=>{
        res.status(200).json(files)
    })
    .catch(err=>{
        res.status(401).json({msg: err})
    })
})

//GET SINGLE FILE
router.get('/:id', (req,res)=>{
    File.findByPk(req.params.id)
    .then(file =>{
        let fileContents = Buffer.from(file.data, 'base64')  
        let readStream = new stream.PassThrough()        
        readStream.end(fileContents)
        
        res.set('Content-dispostion', 'attachment; filename='+file.name)
        res.set('Content-Type', file.type) 

        readStream.pipe(res)
        // res.status(200).json(file)
    }).catch(err=>{
        res.status(401).json({msg: err})
    })
})

//UPDATE FILE
router.put('/update/:id', upload.single('file'), (req,res)=>{
    File.update({
        type: req.file.mimetype,
        title: req.body.title,
        name: req.file.originalname,
        data: req.file.buffer,
        ownerId: req.user.id
    }, {where: {id: req.params.id}})
    .then(data =>{
        res.status(200).json({data})
    })
    .catch(err=>{
        res.status(500).send({msg: err})
    })
})

//DELETE FILE
router.delete('/delete/:id', (req,res)=>{
    File.destroy({where:{id:req.params.id}})
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).json({msg: err})
    })
})


module.exports = router;