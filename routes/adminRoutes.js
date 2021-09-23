const router=require("express").Router();
const {singin}=require("../controller/adminController");
const {validateSinginRequest, isRequestValidated } = require("../validators/adminValidate");

router.post("/singin",validateSinginRequest,isRequestValidated,singin)

module.exports=router;