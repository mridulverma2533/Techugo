const router=require("express").Router();
const {singup,singin,logout}=require("../controller/customerController")
const Auth=require("../middleware/auth")
const {validateSingupRequest,validateSinginRequest, isRequestValidated}=require("../validators/validate")

router.post("/singup",validateSingupRequest,isRequestValidated,singup );
router.post("/singin",validateSinginRequest,isRequestValidated,singin)
router.post("/logout",Auth,logout)


module.exports=router;