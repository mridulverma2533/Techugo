const User = require("../models/user")
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const addressModel = require("../models/addressModel");
const { send, generateOTP } = require("../helpers/utilitiy");
const productModel = require("../models/productModel");
const Order = require("../models/order.js");
const cartModel = require("../models/cartModel");
const { successResponseWithData,ErrorResponse } = require("../helpers/apiResponse");

const { Mongoose } = require("mongoose");

exports.singup = (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    User.findOne({ email: email })
        .exec((error, user) => {
            if (user) return ErrorResponse(res ,"email allready exits !")
            
        })

    User.findOne({ username: username })
        .exec((error, user) => {
            if (user) return ErrorResponse(res ,"username allready exits !")
        })

    const _user = new User({
        firstName,
        lastName,
        email,
        password,
        username: username
    });;
    _user.save((error, data) => {
        if (error) {
             return ErrorResponse(res ,"Something is wrong!")
        }
        if (data) {
            return successResponseWithData(res, "Success", data );
        }
    })
}

exports.singin = (req, res) => {
    User.findOne({ username: req.body.username })
        .exec((error, user) => {
            if (error) return res.status(400).json(error);
            if (user) {
                if (user.authenticate(req.body.password)) {
                    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECREAT, { expiresIn: '2d' });
                    const { _id, firstName, lastName, username, role, fullName } = user;
                    // res.status(200).json({
                    //     statusCode:res.statusCode,
                    //     APICODERESULT:true,
                        // token,
                        // user: {
                        //     _id, firstName, lastName, username, role, fullName
                        // }
                        // });
                    let data = {  token,
                        user: {
                            _id, firstName, lastName, username, role, fullName
                        }}
                   return successResponseWithData(res, "Success", data );

                } else {
                    // return res.status(400).json({
                    //     message: 'Invalid password'
                    // })
                   return ErrorResponse(res ,"Invalid password !")
                }
            } else {
                 return ErrorResponse(res ,"Invalid username !")
            }
        })
}

exports.getProfile = async (req, res) => {
    const user = req.user;
    let userDetail = await User.findOne({ _id: user._id }, { password: 0, hash_password: 0 });
    return successResponseWithData(res, "Success", userDetail );
}

exports.updateProfile = async (req, res) => {
    try {
        let user = req.user;
        let { firstName, lastName } = req.body;
        let filename = req.file && req.file.filename ? req.file.filename : "";
        let dataToSet = {};
        firstName ? dataToSet.firstName = firstName : true;
        lastName ? dataToSet.lastName = lastName : true;
        filename ? dataToSet.profilePicture = filename : true;
        let updatedUser = await User.findOneAndUpdate({ _id: user._id }, { $set: dataToSet }, { new: true })
        return successResponseWithData(res, "Success", updatedUser );
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res ," something is wrong !")
    }
}

exports.addAddress = async (req, res) => {
    try {
        const user = req.user;
        const { firstName, lastName, pincode, phone, address, city, state, landmark, addressType } = req.body;
        let temp = { firstName, lastName, pincode, phone, address, city, state, landmark, addressType, userId: user._id }
        let addressDetail = await addressModel.create(temp);
        return successResponseWithData(res, "Success", addressDetail );
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res ," something is wrong !") 
    }
}

exports.getAddress = async (req, res) => {
    try {
        const user = req.user;
        let address = await addressModel.find({ userId: user._id, status: "ACTIVE" });
        return successResponseWithData(res,"success",address)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res,{ message: "somethink is wrong!" });
    }
}

exports.editAddress = async (req, res) => {
    try {
        const user = req.user;
        const addressId = req.params.addressId;

        const { firstName, lastName, pincode, phone, address, city, state, landmark, addressType } = req.body;
        let dataToSet = {}
        firstName ? dataToSet.firstName = firstName : true;
        lastName ? dataToSet.lastName = lastName : true;
        pincode ? dataToSet.pincode = pincode : true;
        phone ? dataToSet.phone = phone : true;
        address ? dataToSet.address = address : true;
        city ? dataToSet.city = city : true;
        state ? dataToSet.state = state : true;
        landmark ? dataToSet.landmark = landmark : true;
        addressType ? dataToSet.addressType = addressType : true;

        let updatedAddress = await addressModel.findByIdAndUpdate({ _id: addressId }, { $set: dataToSet }, { new: true });
        return successResponseWithData(res,"success",updatedAddress)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res,{ message: "somethink is wrong!" });
    }
}

exports.logout = async (req, res) => {
    return successResponseWithData(res, "Success", {} );
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        let otp = generateOTP(6);
        console.log(otp);
        let updatedUser = await User.findOneAndUpdate({ email }, { $set: { forgotPasswordOtp: otp } }, { new: true });
        console.log(updatedUser);
        send(email, "FORGOT PASSWORD", otp)
        return successResponseWithData(res, "Success", {} );
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res ," something is wrong !")
    }
}
// exports.passwordchange= async (req,res)=>{
//     let passwordReset = await User.findOne({ forgotPasswordOtp });
//     if (!passwordReset) {
//       throw new Error("Invalid or expired password reset token");
//     }
//     // const isValid = await bcrypt.compare(token, passwordResetToken.token);
//     // if (!isValid) {
//     //   throw new Error("Invalid or expired password reset token");
//     // }
//     const hash = await bcrypt.hash(password, Number(bcryptSalt));
//     await User.updateOne(
//       {forgotPasswordOtp:req.body.forgotPasswordOtp},
//       { $set: { password: hash } },
//       { new: true }
//     );
// }
exports.passwordchange= async (req,res)=>{
    try{
        const {password}=req.body
        let dataToSet = {}
        password ? dataToSet = password : true;
        const user = await User.findOneAndUpdate({forgotPasswordOtp:req.body.forgotPasswordOtp},{ $set: dataToSet }, { new: true });
        res.status(200).json({user})
    }catch(e){
        res.send(e)
    }
}


exports.getProduct = async (req, res) => {
    const user = req.user;
    const { searchKey } = req.query;

    let searchString = searchKey;
    searchString = new RegExp("^" + searchString, "i");
    let criteria = {}
    searchKey ? criteria.name = searchString : true;

    let products = await productModel.find(criteria).sort({ name: 1 });
    return successResponseWithData(res,"success", products );
}
exports.productDetail = async (req, res) => {
    const productId = req.params.productId;
    let productDetail = await productModel.findOne({ _id: productId });
    return successResponseWithData(res,"success",productDetail)
}


exports.addToCart = async (req, res) => {
    try {
        const { itemId, qty } = req.body;
        const user = req.user;
        let temp = {
            item: itemId,
            qty,
            userId: user._id,
        }
        let itemInCart =  await cartModel.findOne({userId: user._id, item: itemId});
        if(itemInCart){
           let cartData =  await cartModel.findOneAndUpdate({_id: itemInCart._id}, {$inc:{qty: qty}}, {new: true});
            return successResponseWithData(res,"success",cartData)
        }
        let cartData = await cartModel.create(temp);
        return successResponseWithData(res,"success",cartData)

    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res,{ message: "somethink is wrong!" });
    }
}

exports.getCart = async (req, res) => {
    try {
        const user = req.user;
        let cart = await cartModel.find({ userId: user._id }).populate("item");
        return successResponseWithData(res,"success",cart)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res,{ message: "somethink is wrong!" });
    }
}

exports.orderDetails= async (req,res)=>{
    try{
        const order =  new Order(req.body)
        const result = await order.save()
        res.status(200).json(result)

        


    }catch(e){
    res.status(500).json(e)
    }
}

exports.updateCart = async(req,res)=>{
    try {
        const cartId = req.params.cartId;
        const {qty} = req.body;
        let cartData =  await cartModel.findOneAndUpdate({_id: cartId}, {$inc:{qty}}, {new: true});
        return successResponseWithData(res,"success",cartData)
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res,{ message: "somethink is wrong!" });
    }
}

exports.deleteCart = async (req, res)=>{
    try {
        const cartId = req.params.cartId;
        await cartModel.deleteOne({_id: cartId});
            return successResponseWithData(res,"success",{ })
    } catch (error) {
        console.log("error", error);
        return ErrorResponse(res,{ message: "somethink is wrong!" });
    }
}
