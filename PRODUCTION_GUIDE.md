# 🚀 FoodBridge — Enterprise Production & Deployment Guide

Operational handbook for deploying FoodBridge to production environments (AWS ECS / RDS / S3, Kubernetes, Nginx, SSL/TLS, Monitoring, and OWASP Security Hardening).

---

## 📋 Production Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                 AWS CloudFront / Cloudflare CDN             │
│                      (SSL/TLS Termination)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / WSS
┌──────────────────────────────▼──────────────────────────────┐
│                    Nginx Reverse Proxy                      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐  ┌────────────▼──────────────┐
│    AWS ECS Fargate API      │  │  AWS ECS ASGI WebSockets   │
│  (Gunicorn / Django WSGI)   │  │   (Daphne Channels ASGI)   │
└──────────────┬──────────────┘  └────────────┬──────────────┘
               │                              │
┌──────────────▼──────────────────────────────▼───────────────┐
│            AWS ElastiCache Redis (Cache & Broker)           │
│         AWS RDS PostgreSQL + PostGIS (Multi-AZ DB)          │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Nginx Reverse Proxy Configuration

Place the following configuration in `/etc/nginx/sites-available/foodbridge`:

```nginx
server {
    listen 80;
    server_name api.foodbridge.org;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.foodbridge.org;

    ssl_certificate /etc/letsencrypt/live/api.foodbridge.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.foodbridge.org/privkey.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # REST API requests
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket Channels requests
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }
}
```

---

## 2. Docker Container Production Build

### Backend Docker Build
```bash
docker build -t foodbridge-backend:latest -f foodbridge-backend/Dockerfile ./foodbridge-backend
```

### Frontend Docker Build
```bash
docker build -t foodbridge-frontend:latest -f foodbridge-frontend/Dockerfile ./foodbridge-frontend
```

---

## 3. Production Environment Variables Checklist

Ensure these variables are set in AWS Secrets Manager or Kubernetes ConfigMaps:

```ini
DEBUG=False
SECRET_KEY=production-super-secret-key-must-be-long-and-random
ALLOWED_HOSTS=api.foodbridge.org,foodbridge.org
DATABASE_URL=postgres://foodbridge_user:password@rds-instance.rds.amazonaws.com:5432/foodbridge_db
REDIS_URL=redis://elasticache-instance.cache.amazonaws.com:6379/0
CELERY_BROKER_URL=redis://elasticache-instance.cache.amazonaws.com:6379/1
CORS_ALLOWED_ORIGINS=https://foodbridge.org,https://app.foodbridge.org
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

---

## 4. Monitoring & Error Tracking Setup

- **Sentry Integration**: Configure `SENTRY_DSN` in Django `prod.py` and Vite `App.tsx` for error tracking.
- **Prometheus & Grafana**: Expose metrics via `django-prometheus` at `/metrics` to monitor API throughput, database query duration, and WebSocket active connections.
- **Uptime Health Check**: Configure synthetic ping monitor at `/api/v1/admin/monitoring/`.

---

## 5. Security & OWASP Production Hardening Checklist

- [x] **Enforce HTTPS / HSTS**: All HTTP traffic redirected to TLS v1.3 with HSTS header `max-age=31536000`.
- [x] **JWT Token Short Expiry**: Access token lifetime set to 15 minutes with token rotation on refresh.
- [x] **PostGIS ORM Parameterization**: All geospatial radius queries use Django ORM parameterization to prevent SQL injection.
- [x] **IDOR Protection**: Object-level permissions enforced across all endpoints (`IsOwnerOrAdmin`).
- [x] **Rate Limiting / Throttling**: DRF throttle classes configured to prevent SMS OTP bombing and brute force attacks.
- [x] **Secure S3 File Uploads**: Presigned S3 URLs used for document/proof image uploads with MIME-type restriction.
