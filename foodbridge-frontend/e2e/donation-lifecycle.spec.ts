import { test, expect } from '@playwright/test';

test.describe('End-to-End Donation Lifecycle Journey', () => {

  test('Complete 3-sided marketplace workflow: Listing -> NGO Claim -> Volunteer Dispatch -> Admin Audit', async ({ page }) => {
    // 1. Donor logs in and creates surplus food listing
    await page.goto('/login');
    await page.fill('input[name="phone"]', '+155500010');
    await page.click('button[type="submit"]');

    await page.goto('/donor/donations/new');
    await page.fill('input[name="food_type"]', '50 kg Prepared Banquet Meals');
    await page.fill('input[name="quantity_kg"]', '50');
    await page.fill('textarea[name="pickup_address"]', '100 Luxury Avenue, Business Bay');
    await page.click('button:has-text("Submit Donation")');

    // Verify donation listed state
    await expect(page.locator('text=LISTED')).toBeVisible();

    // 2. NGO logs in, browses nearby geospatial map, and claims donation
    await page.goto('/ngo/browse');
    await page.click('button:has-text("Claim Donation")');
    await expect(page.locator('text=CLAIMED')).toBeVisible();

    // 3. Volunteer accepts pickup task and streams live GPS tracking
    await page.goto('/volunteer/tasks/nearby');
    await page.click('button:has-text("Accept Pickup Task")');
    await page.goto('/volunteer/tracking');

    // Verify live tracking map and status updates
    await expect(page.locator('text=LIVE DRIVER GPS')).toBeVisible();
    await page.click('button:has-text("Mark Picked Up")');
    await expect(page.locator('text=IN TRANSIT')).toBeVisible();

    // Upload delivery proof and confirm delivery
    await page.click('button:has-text("Upload Proof & Complete")');
    await expect(page.locator('text=DELIVERED')).toBeVisible();

    // 4. Admin inspects dashboard and verifies audit trail
    await page.goto('/admin/dashboard');
    await expect(page.locator('text=Platform Operations Dashboard')).toBeVisible();
  });

});
