const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../models");

module.exports = {
  findAll: function (req, res) {
    db.Keys
      .find({})
      .sort({ updated_date: -1 })
      .populate({ path: "keys" })
      .then(keys => {
        res.json({ keys });
      })
      .catch(err => res.status(422).json(err));
  }
};
