const User = require("../models/user")
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const addressModel = require("../models/addressModel");
const { send, generateOTP } = require("../helpers/utilitiy");
const productModel = require("../models/productModel");
const cartModel = require("../models/cartModel");

exports.singup = (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;
    User.findOne({ email: email })
        .exec((error, user) => {
            if (user) return res.status(400).json({
                message: "email allready exits"
            })
        })

    User.findOne({ username: username })
        .exec((error, user) => {
            if (user) return res.status(400).json({
                message: "username allready exits"
            })
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
            return res.status(400).json({ message: "somethink is wrong!" });
        }
        if (data) {
            return res.status(200).json({ user: data })
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
                    res.status(200).json({
                        token,
                        user: {
                            _id, firstName, lastName, username, role, fullName
                        }
                    });

                } else {
                    return res.status(400).json({
                        message: 'Invalid password'
                    })
                }
            } else {
                return res.status(400).json('Invalid username address')
            }
        })
}

exports.getProfile = async (req, res) => {
    const user = req.user;
    let userDetail = await User.findOne({ _id: user._id }, { password: 0, hash_password: 0 });
    return res.status(200).json({ userDetail })
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
        return res.status(200).json({ updatedUser })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.addAddress = async (req, res) => {
    try {
        const user = req.user;
        const { firstName, lastName, pincode, phone, address, city, state, landmark, addressType } = req.body;
        let temp = { firstName, lastName, pincode, phone, address, city, state, landmark, addressType, userId: user._id }
        let addressDetail = await addressModel.create(temp);
        return res.status(200).json({ addressDetail })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.getAddress = async (req, res) => {
    try {
        const user = req.user;
        let address = await addressModel.find({ userId: user._id, status: "ACTIVE" });
        return res.status(200).json({ address })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
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
        return res.status(200).json({ updatedAddress })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.logout = async (req, res) => {
    return res.status(200).json({})
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        let otp = generateOTP(6);
        console.log(otp);
        let updatedUser = await User.findOneAndUpdate({ email }, { $set: { forgotPasswordOtp: otp } }, { new: true });
        console.log(updatedUser);
        send(email, "FORGOT PASSWORD", otp)
        return res.status(200).json({})
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
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
    return res.status(200).json({ products })
}
exports.productDetail = async (req, res) => {
    const productId = req.params.productId;
    let productDetail = await productModel.findOne({ _id: productId });
    return res.status(200).json({ productDetail })
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
            return res.status(200).json({ cartData })
        }
        let cartData = await cartModel.create(temp);
        return res.status(200).json({ cartData })

    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.getCart = async (req, res) => {
    try {
        const user = req.user;
        let cart = await cartModel.find({ userId: user._id }).populate("item");
        return res.status(200).json({ cart })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.updateCart = async(req,res)=>{
    try {
        const cartId = req.params.cartId;
        const {qty} = req.body;
        let cartData =  await cartModel.findOneAndUpdate({_id: cartId}, {$inc:{qty}}, {new: true});
            return res.status(200).json({ cartData })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.deleteCart = async (req, res)=>{
    try {
        const cartId = req.params.cartId;
        await cartModel.deleteOne({_id: cartId});
            return res.status(200).json({ })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}