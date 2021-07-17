const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function listShowing() {
  return knex(`movies as m`)
    .select("m.*")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.movie_id")
    .where("mt.is_showing", true);
}

function read(movie_id = 0) {
  return knex("movies").select("*").where({ movie_id }).first();
}

function readWithReviews({movieId = 0}) {
  return knex(`reviews as r`)
    .select("r.*", "c.*")
    .join("movies as m", "r.movie_id", "m.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .where({"m.movie_id": Number(movieId) });
}

module.exports = {
  list,
  listShowing,
  read,
  readWithReviews,
};