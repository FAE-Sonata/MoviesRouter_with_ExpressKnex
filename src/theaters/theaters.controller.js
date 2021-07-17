const theatersService = require("./theaters.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

async function list(req, res, next) {
  const requestUrl = req.originalUrl;
  const regex = 'movies\/[0-9]+\/theaters';
  let listTheaters = await theatersService.list();

  const reduceMapping = {
    m_movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    m_created_at: ["movies", null, "created_at"],
    m_updated_at: ["movies", null, "updated_at"],
    showing_theater: ["movies", null, "theater_id"],
  };
  const IS_MOVIEID_PATH = requestUrl.match(regex) != null;
  if(!IS_MOVIEID_PATH)
    reduceMapping['is_showing'] = ["movies", null,"is_showing"];
  const reduceTheaters = reduceProperties("theater_id", reduceMapping);  
  let listReduced = reduceTheaters(listTheaters);

  const t_renames = {mt_movie_id: "movie_id",//, m_movie_id: "movie_id",
    t_created_at: "created_at", t_updated_at: "updated_at"};

  if(IS_MOVIEID_PATH) {
    let removedMovies = listReduced.map(x => {
      delete x['movies'];
      for(let oldName in t_renames) {
        // source: https://stackoverflow.com/questions/4647817/javascript-object-rename-key
        Object.defineProperty(x, t_renames[oldName] ,
          Object.getOwnPropertyDescriptor(x, oldName));
        delete x[oldName];
      }
      return x;
    });
    res.json({ data: removedMovies });  
  }
  else {
    let renamed = listReduced.map(x => {
      for(let oldName in t_renames) {
        // source: https://stackoverflow.com/questions/4647817/javascript-object-rename-key
        Object.defineProperty(x, t_renames[oldName] ,
          Object.getOwnPropertyDescriptor(x, oldName));
        delete x[oldName];
      }
      delete x['movie_id'];
      return x;
    });
    res.json({ data: renamed });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
};