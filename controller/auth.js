const User=require("../models/user")
const jwt=require("jsonwebtoken");
const {validationResult}=require("express-validator");


exports.singup=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(user) return res.status(400).json({
            message:"email allready exits"
        })
    })

    const {firstName,lastName,email,password}=req.body;

    const _user=new User({
        firstName,
        lastName,
        email,
        password,
        username:Math.random().toString()
    });;
    _user.save((error,data)=>{
        if(error) {
            return res.status(400).json({message:"somethink is wrong!"});
        }
        if(data){
            return res.status(200).json({user:data})
        }
    })
}

exports.singin=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(error) return res.status(400).json(error);
        if(user){
            if(user.authenticate(req.body.password)){
                const token=jwt.sign({_id:user._id},process.env.JWT_SECREAT,{expiresIn:'1h'});
                const {_id,firstName,lastName,email,role,fullName}=user;
                res.status(200).json({
                    token,
                    user:{
                       _id, firstName,lastName,email,role,fullName
                    }
                });

            }else{
                return res.status(400).json({
                    message:'Invalid password'
                })
            }
        }else{
            return res.status(400).json('somethink went wrong')
        }
    })
}

