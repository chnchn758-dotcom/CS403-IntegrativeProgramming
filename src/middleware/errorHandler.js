// Express recognizes this as an error handler specifically because it takes
// 4 arguments (err, req, res, next) — don't remove the unused `next`.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = status === 500
    ? 'Something went wrong on our end.' // never leak raw internal error details
    : err.message;

  res.status(status).json({ error: message });
}

module.exports = errorHandler;