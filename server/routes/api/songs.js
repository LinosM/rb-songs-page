const router = require("express").Router();
const songsController = require("../../controllers/songsController");

router.route("/")
  .get(songsController.findAll)

module.exports = router;
