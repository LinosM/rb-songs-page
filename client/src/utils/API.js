import axios from "axios";

export default {
  // Gets all songs
  getSongs: function() {
    return axios.get("/api/songs");
  }
};
