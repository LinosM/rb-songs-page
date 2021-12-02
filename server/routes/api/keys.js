const router = require("express").Router();
const keysController = require("../../controllers/keysController");

router.route("/")
  .get(keysController.findAll)

module.exports = router;