const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(body) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push('name is required.');
  }
  if (!body.email || !EMAIL_RE.test(body.email)) {
    errors.push('a valid email is required.');
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 8) {
    errors.push('password must be at least 8 characters.');
  }
  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!body.email || !EMAIL_RE.test(body.email)) {
    errors.push('a valid email is required.');
  }
  if (!body.password || typeof body.password !== 'string') {
    errors.push('password is required.');
  }
  return errors;
}

module.exports = { validateRegister, validateLogin };