const User=require("../models/user")
const jwt=require("jsonwebtoken");


exports.singin=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(error) return res.status(400).json(error);
        if(user){
            if(user.authenticate(req.body.password) && user.role==='admin'){
                const token=jwt.sign({_id:user._id, role:user.role},process.env.JWT_SECREAT, {expiresIn: '2d'});
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
