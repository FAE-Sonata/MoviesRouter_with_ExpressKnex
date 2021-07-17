const knex = require("../db/connection");

function read(review_id = 0) {
    return knex("reviews").select("*").where({ review_id }).first();
}

function readWithCritics(review_id = 0) {
    return knex("reviews as r")
        .select("r.review_id", "r.content", "r.score",
            "r.created_at as r_created_at", "r.updated_at as r_updated_at",
            "r.critic_id as r_critic_id", "r.movie_id",
            "c.critic_id as c_critic_id", "c.preferred_name", "c.surname",
            "c.organization_name", "c.created_at as c_created_at",
            "c.updated_at as c_updated_at")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .where({ review_id });
}

function update(updatedReview) {
  return knex("reviews as r")
    .select("*")
    .where({ review_id: updatedReview['review_id']  })
    .update(updatedReview, "*");
} 

function destroy(review_id) {
    return knex("reviews").where({ review_id }).del();
}

module.exports = {
    read,
    readWithCritics,
    update,
    delete: destroy,
};