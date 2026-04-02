import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    require: [true, "enter your username"],
  },
  email: {
    type: String,
    require: [true, "enter your email"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "enter your password"],
  },
  recentSongs: {
  type: [
    {
      title: String,
      poster: String,
    }
  ],
  default: [],
  },
  playlist: {
  type: [
    {
      title: String,
      poster: String,
    }
  ],
  default: [],
},
});

const User = mongoose.model("user", userSchema);
export default User;