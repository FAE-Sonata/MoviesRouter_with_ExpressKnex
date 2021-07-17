const router = require("express").Router();
const theatersRouter = require("../theaters/theaters.router");
// const reviewsRouter = require('../reviews/reviews.router');
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const cors = require("cors");

router.use(cors());

router
  .route("/")
  .get(controller.list) // includes ?is_showing=true
  .all(methodNotAllowed);

router
  .route("/:movieId([0-9]+)/reviews") // only allow digits for input
  .get(controller.readWithReviews)
  .all(methodNotAllowed); // /reviews/ routing not present

router
  .route("/:movieId([0-9]+)") // only allow digits for input
  .get(controller.read)
  .all(methodNotAllowed);

router.use("/:movieId/theaters", controller['movieExists'], theatersRouter);

module.exports = router;