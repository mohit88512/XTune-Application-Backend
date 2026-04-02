import Song from "../model/songSchema.js";
import customResponse from "../utilis/customResponse.js";

export async function songAPI(req,res){
  const { title } = req.body;
  // console.log(title)
  if (!title) {
    return customResponse(res, 400, false, "Title is required", "", "");
  }
  try {
    const foundSong = await Song.findOne({title:title});

    if(!foundSong){
      return customResponse(res, 400, false, "Song Not Found", "", "");
    }
    return customResponse(res, 200, true, "Song Found", "", foundSong);
  } catch (error) {
    return customResponse(res, 500, false, "Internal Server Error", "", "");
  }
}