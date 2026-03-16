import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({

partName:String,

quantity:Number,

vendor:String,

alertLevel:Number

})

export default mongoose.model("Inventory",inventorySchema)