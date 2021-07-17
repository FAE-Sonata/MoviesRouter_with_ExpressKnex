const moviesService = require("./movies.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

async function list(req, res, next) {
  let data = await moviesService.list();
  // handle ?is_showing=true endpoint
  if(req.query['is_showing']) data = await moviesService.listShowing();
  res.json({ data });
}

async function movieExists(req, res, next) {
  const { movieId } = req.params;

  const movie = await moviesService.read(movieId);

  if (movie) {
    res.locals['movie'] = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function read(req, res) {
  res.json({ data: res.locals['movie'] });
}

async function readShowingTheaters(req, res) {
  const listTheaters = await moviesService.readShowingTheaters(req.params);
  res.json({ data: listTheaters });
}

async function readWithReviews(req, res) {
  const listReviews = await moviesService.readWithReviews(req.params);
  const reduceReviews = reduceProperties("review_id", {
    critic_id: ["critic", null, "critic_id"],
    preferred_name: ["critic", null, "preferred_name"],
    surname: ["critic", null, "surname"],
    organization_name: ["critic", null, "organization_name"],
  });
  
  let listReduced = reduceReviews(listReviews);
  const flattenedCritics = listReduced.map(x => {
    const criticObj = x['critic'][0];
    x['critic'] = criticObj;
    return x;
  });

  res.json({ data: flattenedCritics });
}

module.exports = {
  list: asyncErrorBoundary(list),
  movieExists,
  read: [asyncErrorBoundary(movieExists), read],
  readShowingTheaters: [asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readShowingTheaters)],
  readWithReviews: [asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readWithReviews)],
};