exports.up = function (knex) {
    return knex.schema.createTable("reviews", (table) => {
        table.increments("review_id").primary();
        table.text("content").notNullable();
        table.integer("score").unsigned().notNullable();
        table.integer("movie_id").unsigned();
        table
            .foreign("movie_id")
            .references("movies.movie_id")
            // .inTable("movies")
            .onDelete("CASCADE");
        table.integer("critic_id").unsigned();
        table
            .foreign("critic_id")
            .references("critics.critic_id")
            // .inTable("critics")
            .onDelete("CASCADE");
        table.timestamps(true, true);
    });
  };
  
exports.down = function (knex) {
    return knex.schema.dropTable("reviews");
};