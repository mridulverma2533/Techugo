const express=require("express");
const mongoose=require("mongoose");
const env=require("dotenv");
const authRoutes=require("./routes/auth");
const adminRoutes=require("./routes/admin/auth");

const app=express();

app.use(express.json());
env.config();


mongoose.connect(process.env.MONGODB_URL,{useNewUrlparser:true})
.then(()=>{
    console.log("database connection successful");
})
.catch((err)=>{
    console.log(err);
})

app.use("/api",authRoutes);
app.use("/api",adminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})