const knex = require("../db/connection");

function list() {
  return knex(`theaters as t`)
    .select("t.theater_id", "t.name", "t.address_line_1", "t.address_line_2",
      "t.city", "t.state", "t.zip", "t.created_at as t_created_at",
      "t.updated_at as t_updated_at", "mt.is_showing",
      "mt.movie_id as mt_movie_id", "m.movie_id as m_movie_id", "m.title",
      "m.runtime_in_minutes", "m.rating", "m.description", "m.image_url",
      "m.created_at as m_created_at", "m.updated_at as m_updated_at",
      "mt.theater_id as showing_theater")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .leftJoin("movies as m", "mt.movie_id", "m.movie_id")
    .distinct("t.theater_id");
} 

module.exports = {
  list,
};