const express = require('express')

const Users = require("../models/Users")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const checkAuth = require("../middleware/check-auth")
const {loginValidator , registerValidator} = require("../validators/validators")
const bodyParser = require('body-parser')

const router = express.Router()

router.post('/login', (req,res) => {
    const { errors, isValid } = loginValidator(req.body);
    if(!isValid){
        res.json({"success": false, errors})
    }
    else{
        Users.findOne({email: req.body.email}).then( user => {
            if(!user){
                res.json({message : "Email not found" , "success" : false});
            } else{
                bcrypt.compare(req.body.password, user.password).then(success => {
                    if(!success){
                        res.json({message: 'Invalid Password', "success" : false})
                    } else{
                        const payload = {
                            id: user._id,
                            name: user.firstName
                        }
                        jwt.sign(
                            payload,
                            process.env.APP_SECRET , {expiresIn: 2155926},
                            (err, token) => {
                                res.json({
                                    user,
                                    token: 'Bearer Token: ' + token,
                                    "success": true
                                })
                            }
                        )
                    }
                })
            }
        })
    }
})

router.post('/register', (req,res) => {
    const {errors, isValid} = registerValidator(req.body);
    if(!isValid){
        res.json({success: false, errors});
    }
    else{
        const { firstName, lastName, email, password } = req.body;
        const registerUser = new Users({
            firstName,
            lastName,
            email,
            password,
            createdAt : new Date()
        })
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(registerUser.password, salt, (hashErr, hash) => {
                if(err || hashErr){
                    res.json({message: "Error Occured hashing" , success : false})
                    return;
                }
                registerUser.password = hash;
                registerUser.save().then(() => {
                    res.json({"message" : "User Created successfully" , "success" : true})
                }).catch(er => res.json({message: er.message, "success" : false}))
            })
        })
    }
})

module.exports = router;