-- Run this once against the group11 Postgres database before testing auth.
-- Example: psql -h 34.142.204.153 -U group11 -d db_group11 -f sql/001_auth_schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- One row per refresh token that has been issued.
-- This is what makes logout and revocation actually possible (per the
-- "Logout and Revocation" slide: deleting a token client-side does NOT
-- invalidate it server-side unless we track it).
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  revoked     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
