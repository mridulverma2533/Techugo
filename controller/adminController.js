const User=require("../models/user")
const productModel=require("../models/productModel");
const shortid=require("shortid");
const slugify=require("slugify");
const jwt=require("jsonwebtoken");


exports.singin=(req,res)=>{
    User.findOne({email:req.body.email})
    .exec((error,user)=>{
        if(error) return res.status(400).json(error);
        if(user){
            if(user.authenticate(req.body.password) && user.role==='admin'){
                const token=jwt.sign({_id:user._id, role:user.role},process.env.JWT_SECREAT, {expiresIn: '2d'});
                const {_id,firstName,lastName,email,role,fullName}=user;
                res.status(200).json({
                    token,
                    user:{
                       _id, firstName,lastName,email,role,fullName
                    }
                });

            }else{
                return res.status(400).json({
                    message:'Invalid password'
                })
            }
        }else{
            return res.status(400).json('somethink went wrong')
        }
    })
}

exports.createProduct=async(req,res)=>{  
    try {
        const {
            name,price,materials,
            colors,
            packageContents,
            itemSize,
            details,category,
        }=req.body;
        let image=[];
    
        if(req.files.length>0){
            image= req.files.map(file=>{
                return {img:file.filename}
            })
        }
        const product={
            name:name,
            slug:slugify(name),
            price,
            description:{
                materials,
                colors,
                packageContents,
                itemSize,
                details,
            },
            image,
        }
    
       let productData= await productModel.create(product)
        return res.status(200).json(productData)
    } catch (error) {
       return res.status(500).json(error)
    }
       
    }

    exports.logout = async(req,res)=>{
        return res.status(200).json({})
    };

    exports.getProduct = async (req, res) => {
        const user = req.user;
        let userDetail = await productModel.find();
        return res.status(200).json({ userDetail })
    }


    exports.productDetail = async (req, res) => {
        const productId = req.params.productId;
        let productDetail = await productModel.findOne({_id:productId});
        return res.status(200).json({ productDetail })
    }