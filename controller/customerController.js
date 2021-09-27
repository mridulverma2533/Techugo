const User = require("../models/user")
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const addressModel = require("../models/addressModel");
const { send, generateOTP } = require("../helpers/utilitiy");

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
        let {firstName, lastName} = req.body;
        let filename = req.file && req.file.filename ? req.file.filename : "";
        let dataToSet = {};
        firstName? dataToSet.firstName = firstName : true;
        lastName? dataToSet.lastName = lastName : true; 
        filename ? dataToSet.profilePicture = filename : true;
        let updatedUser = await User.findOneAndUpdate({_id: user._id},{$set:dataToSet}, {new: true})
        return res.status(200).json({ updatedUser })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.addAddress = async(req, res)=>{
    try {
        const user = req.user;
        const {firstName , lastName, pincode, phone, address, city, state, landmark, addressType} = req.body;  
        let temp = {firstName , lastName, pincode, phone, address, city, state, landmark, addressType, userId: user._id}
        let addressDetail = await addressModel.create(temp);   
        return res.status(200).json({ addressDetail })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.getAddress  = async(req, res)=>{
    try {
        const user = req.user;
        let address = await addressModel.find({userId: user._id,status:"ACTIVE"});   
        return res.status(200).json({ address })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
} 

exports.editAddress =  async(req, res)=>{
    try {
        const user = req.user;
        const addressId = req.params.addressId;

        const {firstName , lastName, pincode, phone, address, city, state, landmark, addressType} = req.body;  
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

        let updatedAddress = await addressModel.findByIdAndUpdate({_id:addressId}, {$set: dataToSet}, {new: true});   
        return res.status(200).json({ updatedAddress })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}

exports.logout = async(req,res)=>{
    return res.status(200).json({})
}

exports.forgotPassword = (req,res)=>{
    try {
        const {email} = req.body;
        let otp = generateOTP(6);
        send(email, "FORGOT PASSWORD",otp )
        return res.status(200).json({ })
    } catch (error) {
        console.log("error", error);
        return res.status(400).json({ message: "somethink is wrong!" });
    }
}
