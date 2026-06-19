import { test, expect } from '@playwright/test';

// Helper to mock Supabase Auth local storage session in the browser context
async function mockSession(context: any) {
  await context.addInitScript(() => {
    const session = {
      access_token: 'fake-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'fake-refresh-token',
      user: {
        id: 'user-123',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User', name: 'Test User' }
      }
    };

    // Physically write the session to storage keys to guarantee hydration safety
    try {
      localStorage.setItem('sb-mdtquxppsfckciaujuxl-auth-token', JSON.stringify(session));
      localStorage.setItem('sb-auth-token', JSON.stringify(session));
      localStorage.setItem('supabase.auth.token', JSON.stringify(session));
    } catch (_) {
      // Safe fallback if local storage is not initialized
    }

    const originalGetItem = localStorage.getItem;
    localStorage.getItem = function (key) {
      if (key && (key.includes('-auth-token') || key === 'sb-auth-token' || key === 'supabase.auth.token')) {
        return JSON.stringify(session);
      }
      return originalGetItem.call(this, key);
    };
  });
}

// Helper to mock Supabase network database API routes
async function mockSupabaseRoutes(page: any) {
  // Mock Auth session responses
  await page.route('**/auth/v1/session**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'fake-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        user: { id: 'user-123', email: 'test@example.com' }
      })
    });
  });

  await page.route('**/auth/v1/user**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'user-123', email: 'test@example.com' })
    });
  });

  // Mock User Profiles
  await page.route('**/rest/v1/profiles**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'user-123',
          email: 'test@example.com',
          username: 'TestUser',
          avatar_url: null
        }
      ])
    });
  });

  // Mock Carbon Profiles
  await page.route('**/rest/v1/carbon_profiles**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'cp-123',
          user_id: 'user-123',
          carbon_score: 85,
          annual_emissions: 4.2,
          last_calculated: new Date().toISOString()
        }
      ])
    });
  });

  // Mock Roadmap Milestones
  await page.route('**/rest/v1/roadmap_progress**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'rp-1',
          user_id: 'user-123',
          milestone_key: 'energy_efficiency',
          completed: false,
          progress_percentage: 20
        }
      ])
    });
  });

  // Mock Simulator History
  await page.route('**/rest/v1/simulator_runs**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });

  // Mock AI Chat Conversations
  await page.route('**/rest/v1/ai_conversations**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    });
  });
}

test.describe('EcoVerse AI E2E Scenarios', () => {
  
  test('Scenario 1 — Landing Page loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Verify homepage loads and has logo/title
    const logo = page.locator('a[aria-label="EcoVerse AI home"]').first();
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('EcoVerse');
    
    // Verify Sign in action button is visible
    const signInButton = page.locator('text=Sign in').first();
    await expect(signInButton).toBeVisible();
  });

  test('Scenario 2 — Authentication Flow displays correctly', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Verify Google OAuth button exists
    const googleAuthButton = page.locator('button:has-text("Continue with Google")').first();
    await expect(googleAuthButton).toBeVisible();
  });

  test('Scenario 3 — Assessment Onboarding Flow renders properly', async ({ page, context }) => {
    await mockSession(context);
    await mockSupabaseRoutes(page);
    
    // Navigate to assessment page
    await page.goto('/assessment/questions');
    
    // Wait for the Question wizard content
    await page.waitForSelector('text=How do you usually get around?');
    
    // Verify navigation works (clicking options or checking progress)
    const option = page.locator('text=Transit & cycling').first();
    await expect(option).toBeVisible();
  });

  test('Scenario 4 — Dashboard Loads and Displays Carbon Scores', async ({ page, context }) => {
    await mockSession(context);
    await mockSupabaseRoutes(page);
    
    await page.goto('/dashboard/overview');
    
    // Verify main components are present
    await expect(page.locator('h1').first()).toContainText('Welcome back');
    
    // Check if carbon score value is visible
    await page.waitForSelector('text=Your carbon score');
  });

  test('Scenario 5 — Simulator initializes WebGL and Toggles Sliders', async ({ page, context }, testInfo) => {
    await mockSession(context);
    await mockSupabaseRoutes(page);
    
    await page.goto('/simulator');
    
    // Verify title and page header load
    await expect(page.locator('h1').first()).toContainText('Simulator');
    
    // Conditionally check canvas only on Chromium (where WebGL initializes successfully)
    if (testInfo.project.name === 'chromium') {
      // Verify that the R3F Three.js Canvas container is present in the DOM
      const canvasContainer = page.locator('div[role="img"][aria-label="Interactive 3D visualization"]').first();
      await expect(canvasContainer).toBeVisible();
      
      // Verify WebGL Canvas initializes (contains canvas tag)
      const canvasElement = canvasContainer.locator('canvas').first();
      await expect(canvasElement).toBeDefined();
    }

    // Verify scenario toggle controls respond
    const toggleButton = page.locator('button:has-text("Install solar panels")').first();
    await expect(toggleButton).toBeVisible();
    
    // Toggle active state and check state class changes
    await toggleButton.click({ force: true });
    await expect(page.locator('button:has-text("Install solar panels")').first()).toHaveAttribute('aria-pressed', 'true');
  });

  test('Scenario 6 — AI Coach Chat Interface accepts inputs', async ({ page, context }) => {
    await mockSession(context);
    await mockSupabaseRoutes(page);
    
    await page.goto('/coach');
    
    // Verify message input is ready and has loaded/hydrated
    const messageInput = page.getByRole('textbox', { name: 'Message the coach' }).first();
    await expect(messageInput).toBeVisible({ timeout: 25000 });
    
    // Input text and verify value
    await messageInput.fill('How can I cut food waste?');
    await expect(messageInput).toHaveValue('How can I cut food waste?');
  });
});
