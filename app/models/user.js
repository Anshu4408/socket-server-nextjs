import mongoose from "mongoose";
const Schema=new mongoose.Schema({
    
    email:String,

    friends:[String],
    messages:[String],
    
})
export default mongoose.models.userdetail || mongoose.model('userdetail', Schema)