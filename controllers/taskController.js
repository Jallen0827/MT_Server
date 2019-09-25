//REQUIRED PACKAGES
const router = require('express').Router()
const Task = require('../db').import('../models/task')

//CREATE TASK
router.post('/create', (req,res)=>{
    Task.create({
        task:req.body.task,
        type:req.body.type,
        owner: req.user.id
    }).then(data=>{
        res.status(200).json(data)
    }).catch(err=>{
        res.status(500).json({error:err})
    })
})

//UPDATE TASK
router.put('/update/:id', (req,res)=>{
    Task.update({
        task:req.body.task,
        type:req.body.type
    }, {where:{id: req.params.id}})

    .then(data =>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).send({msg: err})
    })
})

//GET ALL TASKS
router.get('/', (req,res)=>{
    Task.findAll()
    .then(tasks=>{
        res.status(200).json(tasks)
    })
    .catch(err=>{
        res.status(401).json({msg: err})
    })
})

//DELETE ALL DONE TASKS
router.delete('/delete', (req,res)=>{
    Task.destroy({where:{type:'Done'}})
    .then(data=>{
        res.status(200).json(data)
    })
    .catch(err=>{
        res.status(500).json({msg: err})
    })
})

module.exports = router;


// router.post('/upload', upload.single('file'), (req, res) => {
//     console.log(req.body)
//     awsFile.create({
//         location: req.file.location,
//         title: req.body.title,
//         owner_id: req.user.id
//     })
//         .then(successData => res.status(200).json({ successData }))
//         .catch(err => {
//             res.status(500).json({ error: err })
//             console.log(err);
//         })
// });

// router.get('/awsFile/:id', (req, res) => {
//     awsFile.findOne({
//         where: {
//             id: req.params.id,
//         }
//     }).then(foundImage => {
//             res.status(200).json(foundImage);
//         })
//         .catch(err => {
//             res.status(500).json(err);
//         })
// })

