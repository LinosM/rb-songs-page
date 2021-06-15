const router = require("express").Router();
const songRoutes = require("./songs");

// Song routes
router.use("/songs", songRoutes);

module.exports = router;
