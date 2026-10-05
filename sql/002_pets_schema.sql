CREATE TABLE IF NOT EXISTS pets (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  species    VARCHAR(100) NOT NULL,
  breed      VARCHAR(100),
  age        INTEGER,
  owner_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON pets(owner_id);