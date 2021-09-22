const router=require("express").Router();
const {singup,singin}=require("../controller/auth")
const {validateSingupRequest,validateSinginRequest, isRequestValidated}=require("../validators/auth")

router.post("/singin",validateSinginRequest,isRequestValidated,singin)

router.post("/singup",validateSingupRequest,isRequestValidated,singup );

module.exports=router;