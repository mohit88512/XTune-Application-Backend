import MusicList from "../model/musicSchema.js";
import customResponse from "../utilis/customResponse.js";

async function musicListAPI(req,res){
  const { title } = req.body;
  // console.log(title)
  if (!title) {
    return customResponse(res, 400, false, "Title is required", "", "");
  }
  try {
    const foundSong = await MusicList.findOne({title:title});

    if(!foundSong){
      return customResponse(res, 400, false, "Song list not found", "", "");
    }
    return customResponse(res, 200, true, "Song list found", "", foundSong);
  } catch (error) {
    return customResponse(res, 500, false, "Internal Server Error", "", "");
  }
}

export default musicListAPI

// Random 25 songs fetch karo saari musclists se explore page ke liye

export async function getRandomSongs(req, res) {
  try {
    // saari music lists lo
    const allLists = await MusicList.find({});

    if (!allLists || allLists.length === 0) {
      return customResponse(res, 404, false, "No songs found", "", "");
    }

    // saari lists ke songs ek array mein dalo

    let allSongs = [];

    allLists.forEach((list) => {
      list.songs.forEach((song) => {
        allSongs.push({
          title: song.title,
          poster: song.poster,
        });
      });
    });

    // shuffle karo
    allSongs = allSongs.sort(() => Math.random() - 0.5);

    // sirf 35 lo
    const random25 = allSongs.slice(0, 35);

    return customResponse(res, 200, true, "Random songs fetched", "", random25);
  } catch (error) {
    return customResponse(res, 500, false, "Internal Server Error", "", "");
  }
}

// Search songs by title query ke through across all music lists
export async function searchSongs(req, res) {
  const { query } = req.query; // ?query=shape

  if (!query) {
    return customResponse(res, 400, false, "Query is required", "", "");
  }

  try {
    const allLists = await MusicList.find({});

    let matchedSongs = [];

    allLists.forEach((list) => {
      list.songs.forEach((song) => {
        // title mein query match karo (case insensitive)
        if (song.title.toLowerCase().includes(query.toLowerCase())) {
          matchedSongs.push({
            title: song.title,
            poster: song.poster,
          });
        }
      });
    });

    return customResponse(res, 200, true, "Songs found", "", matchedSongs);
  } catch (error) {
    return customResponse(res, 500, false, "Internal Server Error", "", "");
  }
}