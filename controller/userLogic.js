import User from "../model/userSchema.js";
import customResponse from "../utilis/customResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// dotenv.config();

// Handle user signup
export async function handleSignup(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return customResponse(res, 400, false, "Fill Full details", "", "");
  }

  // email is in proper format - regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return customResponse(res, 400, false, "Invalid email format", "", "");
  }

  // strong password - regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return customResponse(res, 400, false, "Invalid password format", "", "");
  }

  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });

    if (foundUser) {
      return customResponse(res, 400, false, "User Already exists", "", "");
    }

    let newUser = new User({
      userName: name,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
    });
    let savedUser = await newUser.save();

    if (savedUser) {
      return customResponse(res,200,true,"Successfully Signed Up","",{email:email,userName:name},);
    }
  } catch (err) {
    return customResponse(res, 500, false, "error!!!", err, "");
  }
}

// Handle user login
export async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return customResponse(res, 400, false, "Fill Full details", "", "");
  }
  try {
    const foundUser = await User.findOne({ email: email.toLowerCase() });

    if (!foundUser) {
      return customResponse(res, 400, false, "User Not Found", "", "");
    }

    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordMatch) {
      return customResponse(res, 400, false, "Invalid Password", "", "");
    }

    const payload = { email: foundUser.email, userName: foundUser.userName ,playlist: foundUser.playlist,recentSongs: foundUser.recentSongs};

    const token = jwt.sign( { id: foundUser._id, email: foundUser.email },process.env.JWT_SECRET_KEY,{ expiresIn: "1h" })

    res.cookie("token", token, {  httpOnly: true,secure: false,sameSite: "Lax"});

    return customResponse(res, 200, true, "Login Successful", "", payload);
  } catch (err) {
    return customResponse(res, 500, false, "error!!!", err, "");
  }
}

// Handle user logout
export async function handleLogout(req,res){
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax"
    });
    // console.log("User logged out successfully");
    return customResponse(res, 200, true, "Logout Successful", "", "");
  
  } catch (err) {
    return customResponse(res, 500, false, "Server error", err, "");
  }
}

// Add song to user's recentSongs array
export async function addRecentSong(req, res) {
  const { title, poster } = req.body;  // ← songTitle ki jagah title aur poster
  const userId = req.user.id;

  if (!title) {
    return customResponse(res, 400, false, "Song title is required", "", "");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return customResponse(res, 404, false, "User not found", "", "");
    }

    // duplicate remove, front mein add, max 10
    user.recentSongs = [
      { title, poster },
      ...user.recentSongs.filter((s) => s.title !== title),
    ].slice(0, 10);

    await user.save();

    return customResponse(res, 200, true, "Recent song added", "", user.recentSongs);
  } catch (err) {
    return customResponse(res, 500, false, "Server error", err, "");
  }
}

// Get user's recentSongs array
export async function getRecentSongs(req, res) {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("recentSongs");

    if (!user) {
      return customResponse(res, 404, false, "User not found", "", "");
    }

    return customResponse(res, 200, true, "Recent songs fetched", "", user.recentSongs);
  } catch (err) {
    return customResponse(res, 500, false, "Server error", err, "");
  }
}

// Playlist mein song add karo
export async function addToPlaylist(req, res) {
  const { title, poster } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    // already hai to skip
    const alreadyExists = user.playlist.find((s) => s.title === title);
    if (alreadyExists) {
      return customResponse(res, 400, false, "Song already in playlist", "", "");
    }

    user.playlist.push({ title, poster });
    await user.save();

    return customResponse(res, 200, true, "Song added to playlist", "", user.playlist);
  } catch (err) {
    return customResponse(res, 500, false, "Server error", err, "");
  }
}

// Playlist se song remove karo
export async function removeFromPlaylist(req, res) {
  const { title } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    user.playlist = user.playlist.filter((s) => s.title !== title);
    await user.save();

    return customResponse(res, 200, true, "Song removed from playlist", "", user.playlist);
  } catch (err) {
    return customResponse(res, 500, false, "Server error", err, "");
  }
}

// Playlist fetch karo
export async function getPlaylist(req, res) {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("playlist");
    return customResponse(res, 200, true, "Playlist fetched", "", user.playlist);
  } catch (err) {
    return customResponse(res, 500, false, "Server error", err, "");
  }
}