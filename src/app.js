if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();

const theatersRouter = require("./theaters/theaters.router.js");
const moviesRouter = require("./movies/movies.router.js");
const reviewsRouter = require("./reviews/reviews.router.js");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

app.use(express.json()); // required for request.body to NOT be undefined
app.use(express.urlencoded());

app.use("/theaters", theatersRouter);
app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;