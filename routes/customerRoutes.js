const router=require("express").Router();
const auth = require("../middleware/index.js").requireSingin;
const {validateSingupRequest,validateSinginRequest, isRequestValidated}=require("../validators/validate")
const controller = require("../controller/customerController")

router.post("/singup",validateSingupRequest,isRequestValidated,controller.singup );
router.post("/singin",validateSinginRequest,isRequestValidated,controller.singin)
router.get("/profile",auth, controller.getProfile)
router.put("/profile",auth,controller.updateProfile)
router.post("/address",auth,controller.addAddress)
router.get("/address",auth,controller.getAddress)
router.put("/address/:addressId",auth,controller.editAddress)
router.post("/logout",auth,controller.logout)
router.post("/forgotPassword",auth,controller.forgotPassword)





module.exports=router;