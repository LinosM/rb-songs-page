const router = require("express").Router();
const songRoutes = require("./songs");
const keysRoutes = require("./keys");

// Song routes
router.use("/songs", songRoutes);
router.use("/keys", keysRoutes);

module.exports = router;
