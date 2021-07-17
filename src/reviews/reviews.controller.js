const reviewsService = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;

    const review = await reviewsService.read(reviewId);

    if (review) {
        res.locals['review'] = review;
        return next();
    }
    next({ status: 404, message: "Review cannot be found." });
}

async function update(request, res) {
    const updatedReview = {
        ...res.locals['review'],
        ...request.body['data'],
        review_id: res.locals['review']['review_id'],
    };

    const updatedRecord = await reviewsService.update(updatedReview);
    const withCritics = await reviewsService.readWithCritics(Number(updatedReview[
        'review_id']));
    const r_renames = {r_critic_id: "critic_id", r_created_at: "created_at",
        r_updated_at: "updated_at"};
    const reduceMapping = {
        c_critic_id: ["critic", null, "critic_id"],
        preferred_name: ["critic", null, "preferred_name"],
        surname: ["critic", null, "surname"],
        organization_name: ["critic", null, "organization_name"],
        c_created_at: ["critic", null, "created_at"],
        c_updated_at: ["critic", null, "updated_at"],
    };

    const reduceReviews = reduceProperties("review_id", reduceMapping);
    let listReduced = reduceReviews(withCritics);
    let renamed = listReduced.map(x => {
        x['critic'] = x['critic'][0];
        for(let oldName in r_renames) {
          // source: https://stackoverflow.com/questions/4647817/javascript-object-rename-key
          Object.defineProperty(x, r_renames[oldName] ,
            Object.getOwnPropertyDescriptor(x, oldName));
          delete x[oldName];
        }
        return x;
    });
    res.json({ data: renamed[0] });
}

async function destroy(req, res, next) {
    reviewsService
        .delete(res.locals['review']['review_id'])
        .then(() => res.sendStatus(204))
        .catch(next);
}

module.exports = {
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};