const router=require("express").Router();
const {singup,singin}=require("../controller/customerController")
const {validateSingupRequest,validateSinginRequest, isRequestValidated}=require("../validators/validate")

router.post("/singup",validateSingupRequest,isRequestValidated,singup );
router.post("/singin",validateSinginRequest,isRequestValidated,singin)


module.exports=router;