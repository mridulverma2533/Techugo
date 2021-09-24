const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        min:2,
        max:30
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        min:2,
        max:30
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    hash_password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    contectNumber:{
        type:String
    },
    profilePicture:{
        type:String
    }
},{timestamps:true});


userSchema.virtual('password')
.set(function(password){
    this.hash_password=bcrypt.hashSync(password,10);
});
userSchema.virtual('fullName')
.get(function(){
    return `${this.firstName} ${this.lastName}`;
})

userSchema.methods={
    authenticate: function(password){
        return bcrypt.compareSync(password, this.hash_password);
    }
}
let userModel =mongoose.model("User",userSchema); 

userModel.findOne({role:"admin"}, (err, dbData)=>{
    if(err) return console.log("err", err);
    if(dbData) return;
    userModel.create({
        email:"admin@admin.com",
        password:"12345678",
        firstName:"admin",
        lastName:"admin",
        role: "admin",
        username:"admin"
    }, (err, dbData2)=>{
        if(err) return console.log("err", err);
       return console.log("dbData2", dbData2);
    })
})
module.exports=userModel;