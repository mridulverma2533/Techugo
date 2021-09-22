const jwt=require('jsonwebtoken');

exports.requireSingin=(req,res,next)=>{
    if(req.headers.authorization){
        const token=req.headers.authorization.split(" ")[1];
        const user=jwt.verify(token,process.env.JWT_SECREAT);
        req.user=user;
        
    }else{
        return res.status(400).json({message:'Authorization required'});
    }
   
    next();
}
