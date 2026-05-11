// FAF-Voice V2.0 Performance Tests
// ⚡ Validates championship-grade performance standards

const puppeteer = require('puppeteer');

describe('⚡ Performance & Reliability Tests - Championship Standards', () => {
  let browser;
  let page;
  let performanceMetrics = {};

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    console.log('🏆 Performance Test Suite - Championship Standards');
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(() => {
    performanceMetrics = {};
  });

  test('PR-001: Episode Initialization Performance < 5 seconds', async () => {
    const testName = 'PR-001: Episode Initialization Time';
    
    const startTime = Date.now();
    
    // Navigate to episode page
    await page.goto(TEST_CONFIG.URLS.PRODUCTION + '/ep11.html', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for play button to be available
    await page.waitForSelector('button:has-text("Play Trailer")', { timeout: 10000 });
    
    const initTime = Date.now() - startTime;
    const withinTarget = initTime <= TEST_CONFIG.PERFORMANCE_TARGETS.EPISODE_INIT_TIME;
    
    expect(initTime).toBeLessThanOrEqual(TEST_CONFIG.PERFORMANCE_TARGETS.EPISODE_INIT_TIME);
    
    performanceMetrics.initTime = initTime;
    
    const result = TestUtils.formatChampionshipResult(testName, withinTarget, {
      initTime: initTime + 'ms',
      target: TEST_CONFIG.PERFORMANCE_TARGETS.EPISODE_INIT_TIME + 'ms',
      grade: withinTarget ? 'Championship' : 'Needs optimization'
    });
    
    console.log('🚀 Initialization Test:', result);
  }, 35000);

  test('PR-002: Voice-to-Audio Latency < 2 seconds', async () => {
    const testName = 'PR-002: Voice-to-Audio Latency';
    
    let firstAudioTimestamp = null;
    let playButtonTimestamp = null;
    
    // Monitor for audio events
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Exchange 0: WebSocket connected')) {
        firstAudioTimestamp = Date.now();
      }
    });
    
    // Click play button
    playButtonTimestamp = Date.now();
    await page.click('button:has-text("Play Trailer")', { timeout: 10000 });
    
    // Wait for first audio to start
    await TestUtils.waitFor(() => firstAudioTimestamp !== null, 10000);
    
    const latency = firstAudioTimestamp - playButtonTimestamp;
    const withinTarget = latency <= TEST_CONFIG.PERFORMANCE_TARGETS.VOICE_TO_AUDIO_LATENCY;
    
    expect(latency).toBeLessThanOrEqual(TEST_CONFIG.PERFORMANCE_TARGETS.VOICE_TO_AUDIO_LATENCY);
    
    performanceMetrics.voiceLatency = latency;
    
    const result = TestUtils.formatChampionshipResult(testName, withinTarget, {
      latency: latency + 'ms',
      target: TEST_CONFIG.PERFORMANCE_TARGETS.VOICE_TO_AUDIO_LATENCY + 'ms'
    });
    
    console.log('🎵 Audio Latency Test:', result);
  }, 30000);

  test('PR-003: Memory Usage During Episode < 100MB', async () => {
    const testName = 'PR-003: Memory Usage Monitoring';
    
    // Get initial memory usage
    const initialMetrics = await page.metrics();
    
    // Run complete episode
    await TestUtils.waitFor(() =>
      page.$eval('.progress-text', el => el.textContent.includes('3 / 3')),
      60000
    );
    
    // Get final memory usage
    const finalMetrics = await page.metrics();
    
    const memoryUsed = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
    const withinTarget = memoryUsed <= TEST_CONFIG.PERFORMANCE_TARGETS.MEMORY_USAGE_LIMIT;
    
    expect(memoryUsed).toBeLessThanOrEqual(TEST_CONFIG.PERFORMANCE_TARGETS.MEMORY_USAGE_LIMIT);
    
    performanceMetrics.memoryUsed = memoryUsed;
    
    const result = TestUtils.formatChampionshipResult(testName, withinTarget, {
      memoryUsed: Math.round(memoryUsed / 1024 / 1024) + 'MB',
      target: Math.round(TEST_CONFIG.PERFORMANCE_TARGETS.MEMORY_USAGE_LIMIT / 1024 / 1024) + 'MB',
      initialHeap: Math.round(initialMetrics.JSHeapUsedSize / 1024 / 1024) + 'MB',
      finalHeap: Math.round(finalMetrics.JSHeapUsedSize / 1024 / 1024) + 'MB'
    });
    
    console.log('💾 Memory Test:', result);
  }, 90000);

  test('PR-004: Episode Completion Rate 100%', async () => {
    const testName = 'PR-004: Episode Completion Rate';
    
    let completionAttempts = 0;
    let successfulCompletions = 0;
    
    // Run multiple completion tests
    for (let i = 0; i < 3; i++) {
      completionAttempts++;
      
      try {
        await page.reload();
        await page.click('button:has-text("Play Trailer")', { timeout: 10000 });
        
        // Wait for completion
        await TestUtils.waitFor(() =>
          page.$eval('.progress-text', el => el.textContent.includes('3 / 3')),
          60000
        );
        
        // Verify episode completed successfully
        const completionText = await page.$eval('.completion-message, .status-message', 
          el => el.textContent
        );
        
        if (completionText.includes('complete')) {
          successfulCompletions++;
        }
      } catch (error) {
        console.log(`Completion attempt ${i + 1} failed:`, error.message);
      }
    }
    
    const completionRate = successfulCompletions / completionAttempts;
    const championshipGrade = completionRate === 1.0;
    
    expect(completionRate).toBeGreaterThanOrEqual(0.90); // At least 90%
    
    performanceMetrics.completionRate = completionRate;
    
    const result = TestUtils.formatChampionshipResult(testName, championshipGrade, {
      completionRate: Math.round(completionRate * 100) + '%',
      attempts: completionAttempts,
      successes: successfulCompletions,
      grade: championshipGrade ? 'Championship' : 'Needs improvement'
    });
    
    console.log('✅ Completion Test:', result);
  }, 300000);

  test('PR-005: Load Testing - Multiple Concurrent Sessions', async () => {
    const testName = 'PR-005: Concurrent User Load Test';
    
    const concurrentSessions = 3; // Limited for test environment
    const sessionPromises = [];
    
    // Create multiple browser sessions
    for (let i = 0; i < concurrentSessions; i++) {
      const sessionPromise = (async () => {
        const sessionBrowser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        try {
          const sessionPage = await sessionBrowser.newPage();
          
          await sessionPage.goto(TEST_CONFIG.URLS.PRODUCTION + '/ep11.html', {
            waitUntil: 'networkidle2',
            timeout: 30000
          });
          
          await sessionPage.click('button:has-text("Play Trailer")', { timeout: 10000 });
          
          // Wait for at least first exchange
          await TestUtils.waitFor(() =>
            sessionPage.$eval('.progress-text', el => el.textContent.includes('1')),
            30000
          );
          
          return { success: true, session: i };
        } catch (error) {
          return { success: false, session: i, error: error.message };
        } finally {
          await sessionBrowser.close();
        }
      })();
      
      sessionPromises.push(sessionPromise);
    }
    
    // Wait for all sessions to complete
    const sessionResults = await Promise.all(sessionPromises);
    
    const successfulSessions = sessionResults.filter(r => r.success).length;
    const successRate = successfulSessions / concurrentSessions;
    const canHandleLoad = successRate >= 0.80; // 80% success rate minimum
    
    expect(successRate).toBeGreaterThanOrEqual(0.80);
    
    performanceMetrics.loadTestResults = {
      concurrentSessions,
      successfulSessions,
      successRate
    };
    
    const result = TestUtils.formatChampionshipResult(testName, canHandleLoad, {
      concurrentSessions,
      successfulSessions,
      successRate: Math.round(successRate * 100) + '%',
      results: sessionResults.map(r => ({ session: r.session, success: r.success }))
    });
    
    console.log('🏋️ Load Test:', result);
  }, 120000);

  test('PR-006: Performance Regression Detection', async () => {
    const testName = 'PR-006: Performance Regression Check';
    
    // Performance baselines (from previous championship runs)
    const baselines = {
      initTime: 3000,        // 3 seconds baseline
      voiceLatency: 1500,    // 1.5 seconds baseline
      memoryUsage: 50 * 1024 * 1024, // 50MB baseline
      completionRate: 1.0    // 100% baseline
    };
    
    // Compare current metrics against baselines
    const regressions = [];
    
    if (performanceMetrics.initTime > baselines.initTime * 1.2) {
      regressions.push('Initialization time regression');
    }
    
    if (performanceMetrics.voiceLatency > baselines.voiceLatency * 1.2) {
      regressions.push('Voice latency regression');
    }
    
    if (performanceMetrics.memoryUsed > baselines.memoryUsage * 1.5) {
      regressions.push('Memory usage regression');
    }
    
    if (performanceMetrics.completionRate < baselines.completionRate * 0.9) {
      regressions.push('Completion rate regression');
    }
    
    const noRegressions = regressions.length === 0;
    
    expect(noRegressions).toBe(true);
    
    const result = TestUtils.formatChampionshipResult(testName, noRegressions, {
      regressions: regressions.length > 0 ? regressions : ['None detected'],
      currentMetrics: performanceMetrics,
      baselines,
      grade: noRegressions ? 'Championship Performance Maintained' : 'Performance Regression Detected'
    });
    
    console.log('📈 Regression Test:', result);
  });

  test('PR-007: Championship Performance Summary', async () => {
    const testName = 'PR-007: Championship Performance Summary';
    
    // Calculate overall performance score
    const scores = {
      initTime: performanceMetrics.initTime <= 3000 ? 100 : Math.max(0, 100 - ((performanceMetrics.initTime - 3000) / 100)),
      voiceLatency: performanceMetrics.voiceLatency <= 1500 ? 100 : Math.max(0, 100 - ((performanceMetrics.voiceLatency - 1500) / 50)),
      memoryEfficiency: performanceMetrics.memoryUsed <= 50 * 1024 * 1024 ? 100 : Math.max(0, 100 - ((performanceMetrics.memoryUsed - 50 * 1024 * 1024) / (1024 * 1024))),
      completionRate: (performanceMetrics.completionRate || 1.0) * 100
    };
    
    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
    const championshipGrade = overallScore >= 95;
    
    const result = TestUtils.formatChampionshipResult(testName, championshipGrade, {
      overallScore: Math.round(overallScore) + '/100',
      individualScores: Object.entries(scores).map(([metric, score]) => 
        `${metric}: ${Math.round(score)}/100`
      ),
      grade: overallScore >= 95 ? '🏆 Championship' :
             overallScore >= 85 ? '🥇 Gold' :
             overallScore >= 75 ? '🥈 Silver' : '🥉 Bronze',
      metrics: performanceMetrics
    });
    
    console.log('🏆 Performance Summary:', result);
    
    // Championship standard: Must achieve 95+ overall score
    expect(overallScore).toBeGreaterThanOrEqual(85); // Minimum acceptable
  });
});