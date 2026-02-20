# KodBanking

Vite + React frontend with Express backend and MySQL database.

## Setup

### 1. Database (MySQL)

Create the database and tables using the schema:

```bash
mysql -u avnadmin -p < backend/schema.sql
```

Or run `backend/schema.sql` in your MySQL client (Aiven MySQL or local).

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```

Backend runs on http://localhost:3001

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## Environment Variables (backend/.env)

- `DB_HOST` - MySQL host
- `DB_PORT` - 3306 (MySQL default)
- `DB_USER` - avnadmin
- `DB_PASSWORD` - your password
- `DB_NAME` - kodbanking
- `JWT_SECRET` - random string for signing tokens
- `PORT` - 3001
