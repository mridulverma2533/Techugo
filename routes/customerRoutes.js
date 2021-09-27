const router=require("express").Router();
const multer  = require('multer');
const path=require("path");
const fileExtension=require("file-extension")
const crypto=require("crypto")
const auth = require("../middleware/index.js").requireSingin;
const {validateSingupRequest,validateSinginRequest, isRequestValidated}=require("../validators/validate")
const controller = require("../controller/customerController")
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
    cb(
    null,
    raw.toString("hex") + Date.now() + "." + fileExtension(file.mimetype)
    );
    });
    }
    });
var upload = multer({ storage: storage, })

router.post("/singup",validateSingupRequest,isRequestValidated,controller.singup );
router.post("/singin",validateSinginRequest,isRequestValidated,controller.singin)
router.get("/profile",auth, controller.getProfile)
router.put("/profile",auth, upload.single("image"),controller.updateProfile)
router.post("/address",auth,controller.addAddress)
router.get("/address",auth,controller.getAddress)
router.put("/address/:addressId",auth,controller.editAddress)
router.post("/logout",auth,controller.logout)
router.post("/forgotPassword",auth,controller.forgotPassword)





module.exports=router;