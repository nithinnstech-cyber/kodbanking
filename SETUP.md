# KodBanking Setup Guide

## 1. MySQL Database Setup

### Option A: Aiven MySQL (Cloud)

1. Log in to [Aiven Console](https://console.aiven.io)
2. Create or select a MySQL service
3. Copy **Service URI** or these from the service details:
   - **Host** (e.g. `my-service.aivencloud.com`)
   - **Port** (default `25530` for Aiven MySQL)
   - **Database** (e.g. `defaultdb`)
   - **User**: `avnadmin`
   - **Password**: from Aiven (e.g. `AVNS_...`)

4. Update `backend/.env`:
   ```
   DB_HOST=<your-aiven-host>
   DB_PORT=25530
   DB_USER=avnadmin
   DB_PASSWORD=<your-password>
   DB_NAME=defaultdb
   ```

5. Run the schema using Aiven’s web SQL editor or a MySQL client:
   - Open Aiven Console → your MySQL service → **Query**
   - Run contents of `backend/schema-aiven.sql` (for Aiven; use existing DB)

### Option B: Local MySQL

1. Install MySQL (e.g. from mysql.com or XAMPP)

2. Create database and tables:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```

3. Update `backend/.env`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=<your-mysql-password>
   DB_NAME=kodbanking
   ```

---

## 2. Backend Setup

1. **Environment** (already created as `backend/.env`):
   - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
   - JWT_SECRET, PORT

2. **Install & run**:
   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```
   Backend: http://localhost:3001

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

---

## 4. Verify Setup

1. Open http://localhost:5173
2. Go to Register
3. Enter: uid (e.g. 1), username, password, email, phone, role: Customer
4. If you see specific errors (e.g. "Tables not found", "Database connection failed"), follow the messages to fix MySQL setup

---

## Files Updated in This Setup

| File | Purpose |
|------|---------|
| `backend/.env` | DB credentials, JWT secret, port |
| `backend/schema.sql` | Creates `kodusers` and `usertoken` tables |
| `backend/src/routes/register.ts` | More specific error messages |
| `frontend/src/pages/Register.tsx` | Shows backend error details |
