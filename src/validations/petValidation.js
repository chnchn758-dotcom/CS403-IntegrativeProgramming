function validateCreate(body) {
  const errors = [];
  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    errors.push("name is required.");
  }
  if (
    !body.species ||
    typeof body.species !== "string" ||
    !body.species.trim()
  ) {
    errors.push("species is required.");
  }
  if (
    body.age !== undefined &&
    (typeof body.age !== "number" || body.age < 0)
  ) {
    errors.push("age must be a positive number.");
  }
  return errors;
}

function validateUpdate(body) {
  const errors = [];
  if (
    body.name !== undefined &&
    (typeof body.name !== "string" || !body.name.trim())
  ) {
    errors.push("name must be a non-empty string.");
  }
  if (
    body.species !== undefined &&
    (typeof body.species !== "string" || !body.species.trim())
  ) {
    errors.push("species must be a non-empty string.");
  }
  if (
    body.age !== undefined &&
    (typeof body.age !== "number" || body.age < 0)
  ) {
    errors.push("age must be a positive number.");
  }
  return errors;
}

module.exports = { validateCreate, validateUpdate };
