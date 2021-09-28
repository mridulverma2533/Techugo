const jwt=require('jsonwebtoken');

exports.requireSingin=(req,res,next)=>{
    if(req.headers.token){
        const token=req.headers.token
        const user=jwt.verify(token,process.env.JWT_SECREAT);
        req.user=user;
        
    }else{
        return res.status(400).json({message:'Authorization required'});
    }
   
    next();
}

// exports.adminMiddleware=(req,res,next)=>{
//     if(req.user.role!=='admin'){
//         return res.status(400).json({message:'only admin can create the categories'})
//     }
//     next();
// }