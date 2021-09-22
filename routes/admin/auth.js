const router=require("express").Router();
const {singup,singin}=require("../../controller/admin/auth");
const {validateSingupRequest,validateSinginRequest, isRequestValidated } = require("../../validators/auth");

router.post("/admin/singin",validateSinginRequest,isRequestValidated,singin)

router.post("/admin/singup",validateSingupRequest,isRequestValidated,singup );


// router.post("/profile",requireSingin,(req,res)=>{
//     res.status(200).json({message:'user profile'})
// })


module.exports=router;