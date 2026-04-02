import mongoose from "mongoose";

const musicSchema = mongoose.Schema({
  title:{
    type:String,
    require:[true,"enter title"]
  },
  totalSongs:{
    type:Number,
    require:[true,"enter total songs"],
  },
  songs:{
    type:Array,
    require:[true,"enter songs"],
  }
}) 

const MusicList = mongoose.model("musiclists",musicSchema)
export default MusicList