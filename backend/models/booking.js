import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

userId:String,

serviceId:String,

date:String,

vehicle:String,

status:{
type:String,
default:"Pending"
},

trackingStatus:{
type:String,
default:"Car Received"
}

})

export default mongoose.model("Booking",bookingSchema)