# Group 11 Project Setup

A REST API built with Node.js, Express, and PostgreSQL for CS403 - Integrative Programming. It includes JWT-based authentication (register, login, refresh, logout) and a Pets resource with full CRUD.

## Tech stack

- Node.js + Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`) + password hashing (`bcryptjs`)
- Swagger / OpenAPI (`swagger-jsdoc` + `swagger-ui-express`)
- `dotenv` for configuration

## Project structure

src/
index.js # entry point
config/
database.js # PostgreSQL connection pool
swagger.js # Swagger/OpenAPI configuration
controllers/ # request handlers
services/ # business logic
models/ # database queries
middleware/ # JWT auth middleware + global error handler
validations/ # request validation
utils/ # JWT sign/verify helpers
sql/ # SQL schema files
scripts/ # database seed script
postman/ # Postman Collection for testing


## Getting started

### 1. Prerequisites

- Node.js 18+
- A running PostgreSQL database

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `JWT_ACCESS_SECRET` | Secret used to sign access tokens |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token lifetime (default `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (default `7d`) |

`.env` is git-ignored. Never commit real credentials.

### 4. Create the database tables

```bash
node -e "require('dotenv').config(); const fs=require('fs'); const pool=require('./src/config/database'); pool.query(fs.readFileSync('sql/001_auth_schema.sql','utf8')).then(()=>{console.log('Auth schema applied.'); process.exit(0);}).catch(e=>{console.error(e); process.exit(1);});"
node -e "require('dotenv').config(); const fs=require('fs'); const pool=require('./src/config/database'); pool.query(fs.readFileSync('sql/002_pets_schema.sql','utf8')).then(()=>{console.log('Pets schema applied.'); process.exit(0);}).catch(e=>{console.error(e); process.exit(1);});"
```

Optionally seed sample data:
```bash
node scripts/seedDatabase.js
```

### 5. Run the server

```bash
npm run dev     # auto-reload with nodemon
npm start       # plain node
```

The API is available at `http://localhost:3000`.

## API documentation

Interactive Swagger docs are available at **`http://localhost:3000/api-docs`** once the server is running — includes a built-in "Authorize" flow for testing protected routes directly in the browser.

## API endpoints

### Auth

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register a user (`name`, `email`, `password`) |
| POST | `/auth/login` | No | Returns `accessToken` (15m) and `refreshToken` (7d) |
| POST | `/auth/refresh` | No | Exchange a `refreshToken` for a new token pair |
| POST | `/auth/logout` | Yes | Revokes the given `refreshToken` |
| GET | `/profile` | Yes | Returns the logged-in user's info |
| GET | `/admin/users` | Yes (admin role) | Lists all users |

### Pets

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| GET | `/pets` | No | List all pets |
| GET | `/pets/:id` | No | Get a single pet |
| POST | `/pets` | Yes | Create a pet (caller becomes the owner) |
| PUT | `/pets/:id` | Yes (owner or admin) | Update a pet |
| DELETE | `/pets/:id` | Yes (owner or admin) | Delete a pet |

Protected routes require the header `Authorization: Bearer <accessToken>`.

### Example

```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Error handling

Errors are returned as JSON in the form `{ "error": "message" }` (validation errors use `{ "errors": [...] }`). Any unexpected server error is caught by a global error handler and never leaks internal details to the caller.

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Validation failed |
| 401 | Missing/invalid token, or invalid credentials |
| 403 | Not permitted (e.g. not the resource owner, or role check failed) |
| 404 | Resource or route not found |
| 409 | Email already registered |
| 500 | Unexpected server error |

## Testing

A Postman Collection covering both auth and pets endpoints — including validation errors, missing auth, permission checks, and not-found cases — is included at `postman/Group11-MCO1.postman_collection.json`. Import it into Postman and run the collection; access and refresh tokens are saved automatically between requests via test scripts, so no manual copy-pasting is needed.