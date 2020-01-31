const router = require('express').Router()
const Person = require('../db').import('../models/person')

//ADD NEW PERSON 
router.post('/person', (req,res)=>{
    Person.create({
        Name: req.body.Name
    }).then((person)=>{
        res.status(200).json(person)
    }).catch((err)=>{
        res.status(401).send({error: 'failed to add person', msg:err})
    })
})

//GET ALL PERSONS
router.get('/all', (req,res)=>{
    Person.findAll()
    .then(persons=>{
        res.status(200).json(persons)
    })
    .catch(err=>{
        res.status(401).json({msg:err})
    })
})


module.exports = router;