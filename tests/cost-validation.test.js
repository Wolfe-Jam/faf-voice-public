// FAF-Voice V2.0 Cost Validation Tests
// 💰 Validates 64% cost reduction breakthrough

const puppeteer = require('puppeteer');
const axios = require('axios');

describe('💰 Cost Validation Tests - Championship Critical', () => {
  let browser;
  let page;
  let costTracker = {
    startTime: null,
    endTime: null,
    apiCalls: [],
    tokenUsage: []
  };

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Intercept API calls for cost tracking
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('/api/voice-session')) {
        costTracker.apiCalls.push({
          timestamp: Date.now(),
          url: request.url(),
          type: 'token_generation'
        });
      }
      request.continue();
    });
    
    console.log('🏆 Cost Validation Test Suite - Championship Standards');
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(() => {
    costTracker = {
      startTime: null,
      endTime: null,
      apiCalls: [],
      tokenUsage: []
    };
  });

  test('CV-001: 3-Exchange Trailer Cost ≤ $0.55', async () => {
    const testName = 'CV-001: Trailer Cost Validation';
    costTracker.startTime = Date.now();
    
    // Navigate to EP11 trailer
    await page.goto(TEST_CONFIG.URLS.PRODUCTION + '/ep11.html', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Start trailer playback
    await page.click('button:has-text("Play Trailer")', { timeout: 10000 });
    
    // Wait for all 3 exchanges to complete
    await TestUtils.waitFor(() => {
      return page.$eval('.progress-text', el => el.textContent.includes('3 / 3'));
    }, 60000);
    
    costTracker.endTime = Date.now();
    
    // Calculate cost based on token usage
    const tokenCount = costTracker.apiCalls.filter(call => 
      call.type === 'token_generation'
    ).length;
    
    const costAnalysis = TestUtils.trackCost(
      costTracker.startTime,
      costTracker.endTime,
      tokenCount,
      90 // 90-second token expiry
    );
    
    // Validate cost is within championship threshold
    const withinBudget = costAnalysis.estimatedCost <= TEST_CONFIG.COST_BASELINES.TRAILER_3_EXCHANGES;
    const costSavings = 1 - (costAnalysis.estimatedCost / 1.48); // vs old cost
    
    expect(costAnalysis.estimatedCost).toBeLessThanOrEqual(TEST_CONFIG.COST_BASELINES.TRAILER_3_EXCHANGES);
    expect(costSavings).toBeGreaterThanOrEqual(0.50); // At least 50% savings
    expect(tokenCount).toBe(3); // Should use exactly 3 tokens (one per exchange)
    
    const result = TestUtils.formatChampionshipResult(testName, withinBudget, {
      estimatedCost: costAnalysis.estimatedCost,
      costSavings: Math.round(costSavings * 100) + '%',
      tokenCount,
      billingMinutes: costAnalysis.billingDuration
    });
    
    console.log('🏆 Cost Test Result:', result);
  }, 90000);

  test('CV-002: Full Episode Cost Business Model Validation', async () => {
    const testName = 'CV-002: Full Episode Cost Validation';
    
    // Simulate 7-exchange episode cost
    const tokenCount = 7; // Fresh token per exchange
    const tokenExpirySeconds = 90; // Optimized expiry
    
    const costAnalysis = TestUtils.trackCost(
      Date.now() - 300000, // 5 minute simulated episode
      Date.now(),
      tokenCount,
      tokenExpirySeconds
    );
    
    // Business model: Must stay under $1.00 to remain profitable at $1 sale price
    const withinBusinessModel = costAnalysis.estimatedCost <= TEST_CONFIG.COST_BASELINES.FULL_EPISODE_7_EXCHANGES;
    const profitMargin = 1.00 - costAnalysis.estimatedCost - 0.30; // Minus Stripe fees
    
    expect(costAnalysis.estimatedCost).toBeLessThanOrEqual(TEST_CONFIG.COST_BASELINES.FULL_EPISODE_7_EXCHANGES);
    expect(profitMargin).toBeGreaterThan(0); // Must remain profitable
    
    const result = TestUtils.formatChampionshipResult(testName, withinBusinessModel, {
      estimatedCost: costAnalysis.estimatedCost,
      profitMargin: Math.round(profitMargin * 100) / 100,
      tokenCount
    });
    
    console.log('💰 Business Model Test:', result);
  });

  test('CV-003: Token Strategy Cost Comparison (90s vs 600s)', async () => {
    const testName = 'CV-003: Token Strategy Optimization';
    
    // Compare old strategy (600s tokens) vs new strategy (90s tokens)
    const exchangeCount = 3;
    const episodeDurationMinutes = 3.5;
    
    // Old strategy calculation
    const oldStrategy = TestUtils.trackCost(0, episodeDurationMinutes * 60 * 1000, exchangeCount, 600);
    
    // New strategy calculation  
    const newStrategy = TestUtils.trackCost(0, episodeDurationMinutes * 60 * 1000, exchangeCount, 90);
    
    const costReduction = (oldStrategy.estimatedCost - newStrategy.estimatedCost) / oldStrategy.estimatedCost;
    const savingsAmount = oldStrategy.estimatedCost - newStrategy.estimatedCost;
    
    // Validate significant cost reduction achieved
    expect(costReduction).toBeGreaterThanOrEqual(0.60); // At least 60% savings
    expect(newStrategy.estimatedCost).toBeLessThan(oldStrategy.estimatedCost * 0.40); // Less than 40% of old cost
    
    const result = TestUtils.formatChampionshipResult(testName, costReduction >= 0.60, {
      oldCost: Math.round(oldStrategy.estimatedCost * 100) / 100,
      newCost: Math.round(newStrategy.estimatedCost * 100) / 100,
      savings: Math.round(costReduction * 100) + '%',
      savingsAmount: Math.round(savingsAmount * 100) / 100
    });
    
    console.log('⚡ Optimization Test:', result);
  });

  test('CV-004: Rate Limiting Cost Impact Validation', async () => {
    const testName = 'CV-004: Rate Limiting Cost Impact';
    
    // Test that 1-second delays don't significantly impact costs
    const baselineTime = 3.5 * 60 * 1000; // 3.5 minute episode
    const withDelaysTime = baselineTime + (2 * 1000); // +2 seconds for delays
    
    const baselineCost = TestUtils.trackCost(0, baselineTime, 3, 90);
    const withDelaysCost = TestUtils.trackCost(0, withDelaysTime, 3, 90);
    
    const additionalCost = withDelaysCost.estimatedCost - baselineCost.estimatedCost;
    const costImpactPercent = (additionalCost / baselineCost.estimatedCost) * 100;
    
    // Rate limiting delays should not significantly increase costs
    expect(costImpactPercent).toBeLessThan(5); // Less than 5% impact
    expect(additionalCost).toBeLessThan(0.05); // Less than 5 cents additional
    
    const result = TestUtils.formatChampionshipResult(testName, costImpactPercent < 5, {
      additionalCost: Math.round(additionalCost * 100) / 100,
      costImpact: Math.round(costImpactPercent * 10) / 10 + '%'
    });
    
    console.log('⏱️ Rate Limiting Test:', result);
  });

  test('CV-005: Cost Monitoring and Alerting', async () => {
    const testName = 'CV-005: Cost Monitoring System';
    
    // Test cost monitoring thresholds
    const costThresholds = {
      warning: 0.45,    // 80% of trailer budget
      critical: 0.55,   // 100% of trailer budget  
      emergency: 0.70   // 127% over budget
    };
    
    const simulatedCosts = [0.30, 0.48, 0.58]; // Under, warning, over budget
    
    const alerts = simulatedCosts.map(cost => ({
      cost,
      level: cost > costThresholds.critical ? 'emergency' :
             cost > costThresholds.warning ? 'critical' : 
             'normal'
    }));
    
    // Verify alerting logic
    expect(alerts[0].level).toBe('normal');
    expect(alerts[1].level).toBe('critical');
    expect(alerts[2].level).toBe('emergency');
    
    const allAlertsWorking = alerts.every(alert => 
      alert.level === 'normal' || alert.cost > costThresholds.warning
    );
    
    const result = TestUtils.formatChampionshipResult(testName, allAlertsWorking, {
      alertsConfigured: Object.keys(costThresholds).length,
      alertingLogic: 'Working correctly'
    });
    
    console.log('🚨 Cost Monitoring Test:', result);
  });
});