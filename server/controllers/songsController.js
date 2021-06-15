const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../models");

module.exports = {
  findAll: function (req, res) {
    db.Song
      .find({})
      .sort({ updated_date: -1 })
      .populate({ path: "songs" })
      .then(songs => {
        res.json({ songs });
      })
      .catch(err => res.status(422).json(err));
  }
};
