# 🛠 FoodBridge — Local Development & Installation Guide

Complete developer setup guide for running FoodBridge locally with PostgreSQL + PostGIS, Redis, Django Channels, and React Vite.

---

## 📋 Prerequisites
Ensure the following tools are installed on your machine:
- **Node.js**: v18.0.0+ & npm 9.0+
- **Python**: v3.11+ or v3.12
- **PostgreSQL**: v14+ with **PostGIS extension** installed
- **Redis**: v6.0+
- **Docker & Docker Compose**: (Optional, for containerized execution)

---

## 1. Quick Start with Docker Compose (Recommended)

The fastest way to launch the complete FoodBridge stack (Django API, ASGI WebSockets, Celery Workers, Redis, PostgreSQL PostGIS, and React Frontend):

```bash
# 1. Clone repository
git clone https://github.com/VedantTuvar/FoodBridge.git
cd FoodBridge

# 2. Copy environment file
cp foodbridge-backend/.env.example foodbridge-backend/.env

# 3. Spin up complete environment
docker-compose up --build
```

Access services:
- **Frontend App**: `http://localhost:5173`
- **Django REST API**: `http://localhost:8000/api/v1/`
- **Swagger Docs**: `http://localhost:8000/api/docs/`

---

## 2. Manual Local Setup

### Step 1: PostgreSQL & PostGIS Database Setup
```sql
-- Connect to PostgreSQL shell
CREATE DATABASE foodbridge_db;
CREATE USER foodbridge_user WITH PASSWORD 'foodbridge_pass';
GRANT ALL PRIVILEGES ON DATABASE foodbridge_db TO foodbridge_user;

-- Enable PostGIS spatial extension
\c foodbridge_db;
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Step 2: Backend Setup (Python Django)
```bash
cd foodbridge-backend

# Create & activate Python virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements/dev.txt

# Run database migrations
python manage.py migrate

# Create Super Admin account
python manage.py createsuperuser

# Start Django ASGI Server (Daphne / Django Channels)
python manage.py runserver
```

### Step 3: Frontend Setup (React JS Vite)
```bash
cd foodbridge-frontend

# Install dependencies
npm install

# Start Vite Development Server
npm run dev
```

The frontend will be live at `http://localhost:5173`.

---

## 3. Running Background Celery Workers & Redis

For background matching tasks, push notification fan-outs, and report generation:

```bash
# Start Redis Server (if not running natively)
redis-server

# In backend directory, start Celery worker pool:
celery -A config worker --loglevel=info
```
