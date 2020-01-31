const router = require('express').Router()
const Comments = require('../db').import('../models/comments')

router.post('/comments/:id', (req,res)=>{
    Comments.create({
        comment: req.body.comment,
        personId: req.params.id
    }).then((comment)=>{
        res.status(200).json(comment)
    }).catch((err)=>{
        res.status(401).send({error: 'failed to add person', msg:err})
    })
})

router.get('/all/:id', (req, res)=>{
    Comments.findAll({where: {personId: req.params.id}})
    .then(comments => {
        res.status(200).json(comments)
    })
    .catch(err => {
        res.status(401).send({msg:err})
    })
})

module.exports = router;