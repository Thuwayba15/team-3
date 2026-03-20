import { test, expect } from '@playwright/test';

test.describe('Services Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for services
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
    });
  });

  test('should handle student dashboard service', async ({ page }) => {
    // Mock successful dashboard response
    await page.route('**/api/services/app/student-dashboard/get-my-dashboard', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: {
            overallScore: 75,
            topicsMastered: 8,
            lessonsCompleted: 15,
            weakTopics: [
              {
                topicId: '1',
                topicName: 'Algebra',
                masteryScore: 45,
                needsRevision: true
              }
            ],
            topicMasteries: [
              {
                topicId: '1',
                topicName: 'Algebra',
                subjectName: 'Mathematics',
                masteryScore: 45
              }
            ],
            revisionAdvices: [
              {
                topicName: 'Algebra',
                masteryScore: 45,
                advice: 'Review algebraic expressions and equations'
              }
            ],
            motivationalGuidance: 'Keep up the good work!'
          },
          success: true,
          error: null
        })
      });
    });

    await page.goto('/dashboard/student');
    
    // Check if dashboard loads successfully
    await expect(page.locator('.statValue')).toContainText('75%');
    await expect(page.locator('.statValue')).toContainText('8/');
    await expect(page.locator('.statValue')).toContainText('15');
  });

  test('should handle student dashboard service error', async ({ page }) => {
    // Mock error response
    await page.route('**/api/services/app/student-dashboard/get-my-dashboard', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: null,
          success: false,
          error: {
            message: 'Dashboard data not available',
            details: 'Student data not found',
            code: '404'
          }
        })
      });
    });

    await page.goto('/dashboard/student');
    
    // Check for error handling
    await expect(page.locator('.ant-alert-error')).toBeVisible();
    await expect(page.locator('.ant-alert-error')).toContainText('Dashboard data not available');
  });

  test('should handle admin dashboard service', async ({ page }) => {
    // Mock successful admin dashboard response
    await page.route('**/api/services/app/admin-dashboard/get-summary', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: {
            metrics: [
              {
                key: 'total-users',
                label: 'Total Users',
                value: 1500,
                helperText: 'All registered users'
              }
            ],
            roleDistribution: [
              {
                roleName: 'Student',
                count: 1200,
                percent: 80
              }
            ]
          },
          success: true,
          error: null
        })
      });
    });

    await page.goto('/dashboard/admin');
    
    // Check if admin dashboard loads successfully
    await expect(page.locator('.statValue')).toContainText('1500');
  });

  test('should handle parent service', async ({ page }) => {
    // Mock successful parent children response
    await page.route('**/api/services/app/parent/get-my-children', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: [
            {
              studentUserId: '1',
              studentName: 'Thabo Mokoena',
              gradeLevel: 'Grade 10',
              initials: 'TM'
            }
          ],
          success: true,
          error: null
        })
      });
    });

    await page.goto('/dashboard/parent');
    
    // Check if parent dashboard loads successfully
    await expect(page.locator('.childPill')).toBeVisible();
    await expect(page.locator('.childPill')).toContainText('Thabo');
  });

  test('should handle subject service', async ({ page }) => {
    // Mock successful subjects response
    await page.route('**/api/services/app/subject/get-subjects', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: [
            {
              id: '1',
              name: 'Mathematics',
              gradeLevel: 'Grade 10'
            },
            {
              id: '2',
              name: 'Science',
              gradeLevel: 'Grade 11'
            }
          ],
          success: true,
          error: null
        })
      });
    });

    await page.goto('/dashboard/admin/curriculum');
    
    // Check if subjects load successfully
    await expect(page.locator('.subjectItem')).toHaveCount(2);
  });

  test('should handle authentication service', async ({ page }) => {
    // Mock successful login response
    await page.route('**/api/services/app/auth/login', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: {
            accessToken: 'mock-jwt-token',
            expireInSeconds: 3600,
            userId: 1
          },
          success: true,
          error: null
        })
      });
    });

    await page.goto('/');
    
    // Fill login form
    await page.fill('input[placeholder="Username or email address"]', 'testuser');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Check for successful login (redirect or success state)
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('should handle registration service', async ({ page }) => {
    // Mock successful registration response
    await page.route('**/api/services/app/auth/register', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: {
            userId: 1,
            userName: 'newuser',
            emailAddress: 'newuser@example.com'
          },
          success: true,
          error: null
        })
      });
    });

    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[placeholder="First Name"]', 'John');
    await page.fill('input[placeholder="Last Name"]', 'Doe');
    await page.fill('input[placeholder="Username"]', 'johndoe');
    await page.fill('input[placeholder="Email Address"]', 'john@example.com');
    await page.selectOption('select', 'Student');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Check for successful registration
    await expect(page.locator('text=Registration successful')).toBeVisible();
  });

  test('should handle API timeout', async ({ page }) => {
    // Mock timeout response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 408,
        body: JSON.stringify({
          error: {
            message: 'Request timeout',
            details: 'The server took too long to respond'
          }
        })
      });
    });

    await page.goto('/dashboard/student');
    
    // Check for timeout handling
    await expect(page.locator('.ant-alert-error')).toBeVisible();
    await expect(page.locator('.ant-alert-error')).toContainText('Request timeout');
  });

  test('should handle network errors', async ({ page }) => {
    // Mock network error
    await page.route('**/api/**', route => {
      route.abort('connectionfailed');
    });

    await page.goto('/dashboard/student');
    
    // Check for network error handling
    await expect(page.locator('.ant-alert-error')).toBeVisible();
    await expect(page.locator('.ant-alert-error')).toContainText('connection failed');
  });

  test('should handle invalid responses', async ({ page }) => {
    // Mock invalid JSON response
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        body: 'Invalid JSON response'
      });
    });

    await page.goto('/dashboard/student');
    
    // Check for invalid response handling
    await expect(page.locator('.ant-alert-error')).toBeVisible();
  });

  test('should handle service with query parameters', async ({ page }) => {
    // Mock service with subject filter
    await page.route('**/api/services/app/student-dashboard/get-my-dashboard?subjectId=*', route => {
      const url = new URL(route.request().url());
      const subjectId = url.searchParams.get('subjectId');
      
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: {
            overallScore: 85,
            topicsMastered: 10,
            lessonsCompleted: 20,
            weakTopics: [],
            topicMasteries: [],
            revisionAdvices: [],
            motivationalGuidance: 'Excellent progress!'
          },
          success: true,
          error: null
        })
      });
    });

    await page.goto('/dashboard/student?subjectId=math123');
    
    // Check if filtered dashboard loads successfully
    await expect(page.locator('.statValue')).toContainText('85%');
  });

  test('should handle concurrent requests', async ({ page }) => {
    // Mock multiple concurrent requests
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          result: {},
          success: true,
          error: null
        })
      });
    });

    await page.goto('/dashboard/student');
    
    // Trigger multiple requests simultaneously
    await Promise.all([
      page.click('button:has-text("Refresh")'),
      page.click('button:has-text("Retry")'),
      page.reload()
    ]);
    
    // Check that page remains functional
    await expect(page.locator('main')).toBeVisible();
  });

  test('should handle large response data', async ({ page }) => {
    // Mock large response with many topics
    const largeResponse = {
      result: {
        overallScore: 75,
        topicsMastered: 50,
        lessonsCompleted: 100,
        weakTopics: Array.from({ length: 20 }, (_, i) => ({
          topicId: `topic-${i}`,
          topicName: `Topic ${i}`,
          masteryScore: Math.floor(Math.random() * 100),
          needsRevision: Math.random() > 0.5
        })),
        topicMasteries: Array.from({ length: 50 }, (_, i) => ({
          topicId: `topic-${i}`,
          topicName: `Topic ${i}`,
          subjectName: 'Subject',
          masteryScore: Math.floor(Math.random() * 100)
        })),
        revisionAdvices: [],
        motivationalGuidance: 'Great work!'
      },
      success: true,
      error: null
    };

    await page.route('**/api/services/app/student-dashboard/get-my-dashboard', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(largeResponse)
      });
    });

    await page.goto('/dashboard/student');
    
    // Check if large dataset loads without issues
    await expect(page.locator('.heatmapTile')).toHaveCount.greaterThan(10);
    await expect(page.locator('.attentionItem')).toHaveCount.greaterThan(5);
  });
});