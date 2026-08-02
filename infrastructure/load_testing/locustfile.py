import random
import json
from locust import HttpUser, task, between

class DonorUser(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def view_donor_dashboard(self):
        self.client.get("/api/v1/donations/")

    @task(1)
    def create_surplus_donation(self):
        food_types = ["Fresh Bakery Bread", "Banquet Curry & Rice", "Produce Box", "Catered Trays"]
        self.client.post("/api/v1/donations/", json={
            "food_type": random.choice(food_types),
            "quantity_kg": random.randint(10, 100),
            "pickup_address": "100 Commerce Boulevard",
            "perishability_hours": random.randint(2, 8)
        })

class NGOUser(HttpUser):
    wait_time = between(1, 4)

    @task(4)
    def browse_nearby_donations(self):
        self.client.get("/api/v1/donations/?status=listed")

    @task(1)
    def claim_donation(self):
        self.client.post("/api/v1/claims/", json={
            "donation_id": "don-101"
        })

class VolunteerUser(HttpUser):
    wait_time = between(1, 2)

    @task(5)
    def stream_gps_location_ping(self):
        self.client.post("/api/v1/tasks/log-location/", json={
            "latitude": 28.6139 + (random.random() * 0.01),
            "longitude": 77.2090 + (random.random() * 0.01),
            "speed": random.randint(15, 45),
            "eta_minutes": random.randint(5, 20)
        })

class AdminUser(HttpUser):
    wait_time = between(2, 5)

    @task(2)
    def view_admin_stats(self):
        self.client.get("/api/v1/admin/stats/")

    @task(1)
    def generate_csr_report(self):
        self.client.post("/api/v1/analytics/reports/", json={
            "report_type": "csr",
            "parameters": {"format": "pdf"}
        })
