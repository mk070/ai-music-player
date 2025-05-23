// Async handler to wrap each route
const asyncHandler = (fn) => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};

module.exports = asyncHandler;
