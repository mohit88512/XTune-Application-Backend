import mongoose from "mongoose";

const songSchema = mongoose.Schema({
  title:{
    type:String,
    require:[true,"enter title"]
  },
  song:{
    type:String,
    require:[true,"enter song"],
    unique:true
  }
})

const Song = mongoose.model("songs",songSchema)

export default Song