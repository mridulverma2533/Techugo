const express=require("express");
const mongoose=require("mongoose");
const env=require("dotenv");
const customerRoutes=require("./routes/customerRoutes");
const adminRoutes=require("./routes/adminRoutes");

const app=express();

app.use(express.json());
env.config();


mongoose.connect(process.env.MONGODB_URL,{useNewUrlparser:true})
.then(()=>{
    console.log("database connection successful");
}) //
.catch((err)=>{
    console.log(err);
})

app.use("/api/v2/customer",customerRoutes);
app.use("/api/v2/admin",adminRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
})