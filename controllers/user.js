const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signunp = async (req, res, next) => {
    const {name, email, phone, password} = req.body;
    if (!name || !email || !phone || !password) {
     return res.status(403).json({sucess:false, message:'user already exists'})
    }
    try {
     const user = await User.findAll({where:{email}});
 
     if(user.length > 0) {
         return res.status(207).json({success: false, message:'user already exists'});
     } else {
         bcrypt.hash(password, 10, async(err, hash)=> {
             await User.create({name, email, phone, password:hash});
             res.status(201).json({success: true, message: 'signed up successfully'});
         })
     }
    }catch (err) {
     res.status(500).json({message: 'something went wrong'});
    }
    
 }

 exports.login = async (req, res, next) => {

    try {
        const {email, password} = req.body;

    const user = await User.findAll({where:{email}});

    if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, match)=> {
            if (!match) {
                return res.status(207).json({success: false, message:'user is unauthorized'});
            }
            return res.status(201).json({success: true, message:'user logged in successfully', userId:user[0].id, name:user[0].name, token:generateToken(user[0].id)});
        })
    }else {
        return res.status(203).json({success:false, message:'invalid email'});
    }
    }catch (err) {
        res.status(500).json({success:false, message: err})
    }
    
 }

 function generateToken(id) {
    return jwt.sign({userId: id}, process.env.SEC_KEY)
 }