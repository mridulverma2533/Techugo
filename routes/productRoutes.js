const router=require("express").Router();
const { requireSingin } = require("../middleware");
 const { createProduct }=require('../controller/productController')
 const multer=require("multer");
 const shortid=require("shortid");
 const path=require("path");

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, shortid.generate()+ '-' + file.originalname)
    }
  })

  
 const upload=multer({storage});

router.post('/create',requireSingin,upload.array('image'),createProduct);

// router.get('/category/getCategory', getCategories);


module.exports=router;
