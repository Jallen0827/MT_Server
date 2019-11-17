const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//SIGNUP
router.post('/signup', (req,res)=>{
    User.create({
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 10),
    }).then((user)=>{
        let token = jwt.sign({id:user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
        res.status(200).json({
            user: user,
            sessionToken: token
        })
    }).catch((err)=>{
        res.status(401).send({error: 'failed create user', msg: err})
    })
})

//SIGNIN
router.post('/signin', (req,res)=>{
    User.findOne({
        where:{
            userName: req.body.userName
        }
    }).then((user)=>{
        if(user){
            bcrypt.compare(req.body.password, user.password, (err,matches)=>{
                if(matches){
                    let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24})
                    res.status(200).json({
                        user: user,
                        sessionToken: token
                    })
                }else{
                    res.status(502).send({error: err, msg: 'bad gateway'})
                }
            })
        }else{
            res.status(500).send({error: 'Failed to authenticate'})
        }
    }, err => res.status(501).send({error: 'Failed to process'}))
})


module.exports = router;