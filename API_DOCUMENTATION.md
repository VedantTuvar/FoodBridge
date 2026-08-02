# 📖 FoodBridge — Complete REST API & WebSocket Specification

Version: `1.0.0` | Base Path: `/api/v1` | Protocol: `HTTPS` & `WSS`

---

## Table of Contents
1. [Authentication & Authorization](#01-authentication--authorization)
2. [Accounts API](#02-accounts-api)
3. [Donations API](#03-donations-api)
4. [NGOs API](#04-ngos-api)
5. [Volunteers API](#05-volunteers-api)
6. [Tasks & Tracking API](#06-tasks--tracking-api)
7. [Smart Matching API](#07-smart-matching-api)
8. [Notifications & Chat API](#08-notifications--chat-api)
9. [Analytics & Reports API](#09-analytics--reports-api)
10. [Admin Panel API](#10-admin-panel-api)
11. [WebSocket Channels Specification](#11-websocket-channels-specification)

---

## 01 · Authentication & Authorization

FoodBridge uses stateless **JWT Bearer Token Authentication** with short-lived access tokens (15 mins) and rotatable refresh tokens (7 days).

### Auth Headers
```http
Authorization: Bearer <your_jwt_access_token>
Content-Type: application/json
```

---

## 02 · Accounts API

### `POST /api/v1/auth/register/`
Register a new user account (Donor, NGO, Volunteer, Corporate).

### `POST /api/v1/auth/login/`
Authenticate via phone number or email and receive JWT tokens.

---

## 03 · Donations API

### `GET /api/v1/donations/`
List surplus food donations with filtering by status (`listed`, `claimed`, `in_transit`, `delivered`), food category, and perishability.

### `POST /api/v1/donations/`
Create a new surplus food donation listing.

#### Request Body
```json
{
  "food_type": "50 kg Prepared Banquet Meals",
  "quantity_kg": 50.0,
  "perishability_hours": 4,
  "pickup_address": "100 Luxury Avenue, Business Bay",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "available_window_start": "2026-08-02T18:00:00Z",
  "available_window_end": "2026-08-02T22:00:00Z"
}
```

---

## 04 · NGOs API

### `GET /api/v1/ngos/verification-status/`
Check NGO verification state (`pending`, `approved`, `rejected`).

### `POST /api/v1/claims/`
Claim an available surplus food listing for an approved NGO.

---

## 05 · Volunteers API

### `GET /api/v1/volunteers/profile/`
Fetch volunteer driver profile, vehicle mode (`bike`, `car`, `van`, `on_foot`), and delivery stats.

### `POST /api/v1/volunteers/toggle-availability/`
Toggle volunteer online/offline availability status.

---

## 06 · Tasks & Tracking API

### `GET /api/v1/tasks/nearby/`
List available pickup tasks within volunteer operating radius.

### `POST /api/v1/tasks/<task_id>/accept/`
Accept a pickup delivery task.

### `POST /api/v1/tasks/log-location/`
Emit GPS ping for volunteer driver location audit trail.

---

## 07 · Smart Matching API

### `POST /api/v1/matching/recommend/`
Execute AI Smart Matching engine ranking NGO candidates for a food listing.

#### Request Body
```json
{
  "quantity_kg": 35.0,
  "perishability_hours": 3.0,
  "latitude": 28.6139,
  "longitude": 77.2090
}
```

#### Response Body
```json
{
  "success": true,
  "recommended_ngos": [
    {
      "ngo_id": "ngo-101",
      "organization_name": "Hope Harvest Food Bank",
      "distance_km": 1.4,
      "capacity_per_day": 500,
      "rating_avg": 4.9,
      "match_score_percentage": 96,
      "recommendation_reason": "High proximity (1.4 km) & capacity fit (500 meals/day)"
    }
  ]
}
```

---

## 08 · Notifications & Chat API

### `GET /api/v1/notifications/`
List user notifications.

### `GET /api/v1/notifications/unread-count/`
Get real-time unread notification count.

### `GET /api/v1/notifications/chat/<room_id>/`
Fetch message history for a mission chat room.

### `POST /api/v1/notifications/chat/<room_id>/`
Send message to a live coordination chat room.

---

## 09 · Analytics & Reports API

### `GET /api/v1/analytics/impact/`
Fetch platform impact metrics (Food saved, meals served, CO₂ avoided, water saved).

### `GET /api/v1/analytics/charts/`
Fetch visual chart data series (Weekly volume, category breakdown, fulfillment rates).

### `POST /api/v1/analytics/reports/`
Generate certified reports (`donation`, `volunteer`, `ngo`, `corporate`, `csr`).

### `POST /api/v1/analytics/predict-demand/`
Execute AI demand prediction for a district.

---

## 10 · Admin Panel API

### `GET /api/v1/admin/stats/`
Fetch Operations Control Center summary stats.

### `GET /api/v1/admin/verifications/pending/`
Fetch pending NGO document verification queue.

### `PUT /api/v1/admin/verifications/<id>/approve/`
Approve NGO registration.

### `POST /api/v1/admin/emergency/`
Toggle platform Emergency Disaster Mode.

---

## 11 · WebSocket Channels Specification

### 1. Live Task Tracking Stream
- **URL**: `ws://<host>/ws/tracking/<task_id>/`
- **Payload Sent (Driver GPS Ping)**:
  ```json
  {
    "latitude": 28.6240,
    "longitude": 77.2170,
    "speed": 28,
    "heading": 45,
    "eta_minutes": 12
  }
  ```
- **Payload Received**: Broadcast `LOCATION_UPDATE` event to subscribers.

### 2. In-App Real-Time Chat Stream
- **URL**: `ws://<host>/ws/chat/<room_id>/`
- **Payload Sent**:
  ```json
  {
    "message": "I'm 5 mins away from pickup",
    "sender_name": "Alex Johnson",
    "sender_role": "volunteer"
  }
  ```

### 3. Real-Time Notifications Stream
- **URL**: `ws://<host>/ws/notifications/<user_id>/`

### 4. Live Donation Status Stream
- **URL**: `ws://<host>/ws/status/<donation_id>/`
