const pool = require('../config/database');

async function findAll() {
  const result = await pool.query('SELECT * FROM pets ORDER BY id');
  return result.rows;
}

async function findById(id) {
  const result = await pool.query('SELECT * FROM pets WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function create({ name, species, breed, age, ownerId }) {
  const result = await pool.query(
    `INSERT INTO pets (name, species, breed, age, owner_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, species, breed || null, age || null, ownerId]
  );
  return result.rows[0];
}

async function update(id, fields) {
  const allowed = ['name', 'species', 'breed', 'age'];
  const keys = Object.keys(fields).filter((key) => allowed.includes(key));
  if (keys.length === 0) return findById(id);

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = keys.map((key) => fields[key]);

  const result = await pool.query(
    `UPDATE pets SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query('DELETE FROM pets WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

module.exports = { findAll, findById, create, update, remove };
