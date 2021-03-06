const router = require("express").Router();
const controller = require("./reviews.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router
  .route("/:reviewId([0-9]+)") // only allow digits for input
  .put(controller['update'])
  .delete(controller['delete'])
  .all(methodNotAllowed);

module.exports = router;