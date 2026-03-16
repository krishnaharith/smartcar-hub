import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({

name:String,

category:String,

price:Number,

description:String

})

export default mongoose.model("Service",serviceSchema)