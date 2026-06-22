# UC San Diego Passports Visitor Management

Visitor check-in and queue management for UC San Diego Passport Services.
Built with React + Decorator 5 + FastAPI + SQLite.

## Quick Start

```bash
# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.app:app --reload --port 8000

# Frontend (in another terminal)
npm install
npm run dev
```

Open http://localhost:5173

## Default Passwords

| Location | Password |
|---|---|
| CSC | `csc1960` |
| Bookstore | `book1960` |

## Tech Stack

- **Frontend**: React 18, Vite, Decorator 5 (Bootstrap 3 CDN)
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite
- **Auth**: bcrypt + JWT
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: Docker multi-stage build

## Structure

```
src/              React application
  components/
    chrome/       Decorator 5 page shell
    kiosk/        Public check-in flow
    dashboard/    Staff dashboard
  context/        Global state
  hooks/          useIdleTimer, useSSE
  services/       API client, translations
backend/          FastAPI application
  backend/        Python package
    app.py        Routes and API
    models.py     SQLAlchemy models
    auth.py       JWT + password hashing
    sse.py        Server-Sent Events
    seed.py       Database seeding
```

## API Endpoints

| Method | Path | Auth |
|---|---|---|
| POST | /api/auth/login | Public |
| POST | /api/checkin | Public |
| GET | /api/visitors | JWT |
| PATCH | /api/visitors/:id/status | JWT |
| PATCH | /api/visitors/:id/notes | JWT |
| GET | /api/visitors/export | JWT |
| GET | /api/questions | Public |
| PUT | /api/questions | JWT |
| GET | /api/stats | JWT |
| GET | /events | JWT (SSE) |

## Docker

```bash
docker build -t passports-app .
docker run -p 8000:8000 -v ./passports.db:/app/passports.db passports-app
```
