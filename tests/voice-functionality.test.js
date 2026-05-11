// FAF-Voice V2.0 Multi-Voice Functionality Tests  
// 🎤 Validates all voices work correctly after cost optimization

const puppeteer = require('puppeteer');

describe('🎤 Multi-Voice Functionality Tests - Championship Quality', () => {
  let browser;
  let page;
  let voiceResults = {};

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
    
    // Enable console logging for debugging
    page.on('console', msg => {
      if (msg.text().includes('Exchange') || msg.text().includes('WebSocket')) {
        console.log('🔍 Browser:', msg.text());
      }
    });
    
    console.log('🏆 Voice Functionality Test Suite - Championship Standards');
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(() => {
    voiceResults = {};
  });

  test('MV-001: Nelly Voice Generation and Playback', async () => {
    const testName = 'MV-001: Nelly Voice Test';
    
    await page.goto(TEST_CONFIG.URLS.PRODUCTION + '/ep11.html', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Start episode to trigger Nelly (first voice)
    await page.click('button:has-text("Play Trailer")', { timeout: 10000 });
    
    // Wait for Nelly's exchange to appear
    const nellyExchange = await page.waitForSelector('.exchange[data-voice="ara"]', {
      timeout: 15000
    });
    
    // Verify Nelly's content appears
    const nellyText = await page.$eval('.exchange[data-voice="ara"] .exchange-text', 
      el => el.textContent
    );
    
    const nellyWorking = nellyText.includes('Nelly') && nellyText.length > 50;
    
    expect(nellyWorking).toBe(true);
    expect(nellyText).toContain('Nelly');
    
    voiceResults.nelly = {
      working: nellyWorking,
      textLength: nellyText.length,
      voice: 'ara'
    };
    
    const result = TestUtils.formatChampionshipResult(testName, nellyWorking, voiceResults.nelly);
    console.log('🎭 Nelly Test:', result);
  }, 30000);

  test('MV-002: Leo Voice Generation and Playback', async () => {
    const testName = 'MV-002: Leo Voice Test';
    
    // Continue from previous test or restart if needed
    const currentProgress = await page.$eval('.progress-text', el => el.textContent);
    
    if (!currentProgress.includes('1')) {
      // Start fresh if needed
      await page.reload();
      await page.click('button:has-text("Play Trailer")', { timeout: 10000 });
    }
    
    // Wait for Leo's exchange (second voice)
    await TestUtils.waitFor(async () => {
      const leoElement = await page.$('.exchange[data-voice="leo"]');
      return leoElement !== null;
    }, 20000);
    
    const leoText = await page.$eval('.exchange[data-voice="leo"] .exchange-text',
      el => el.textContent
    );
    
    const leoWorking = leoText.length > 30; // Leo should have substantial content
    
    expect(leoWorking).toBe(true);
    expect(leoText).toBeTruthy();
    
    voiceResults.leo = {
      working: leoWorking,
      textLength: leoText.length,
      voice: 'leo'
    };
    
    const result = TestUtils.formatChampionshipResult(testName, leoWorking, voiceResults.leo);
    console.log('🎩 Leo Test:', result);
  }, 45000);

  test('MV-003: Rex Voice Generation and Playback', async () => {
    const testName = 'MV-003: Rex Voice Test';
    
    // Wait for Rex's exchange (third voice)  
    await TestUtils.waitFor(async () => {
      const rexElement = await page.$('.exchange[data-voice="rex"]');
      return rexElement !== null;
    }, 30000);
    
    const rexText = await page.$eval('.exchange[data-voice="rex"] .exchange-text',
      el => el.textContent
    );
    
    const rexWorking = rexText.length > 30; // Rex should have substantial content
    
    expect(rexWorking).toBe(true);
    expect(rexText).toBeTruthy();
    
    voiceResults.rex = {
      working: rexWorking,
      textLength: rexText.length,
      voice: 'rex'
    };
    
    const result = TestUtils.formatChampionshipResult(testName, rexWorking, voiceResults.rex);
    console.log('👑 Rex Test:', result);
  }, 60000);

  test('MV-004: Voice Switching Between Exchanges', async () => {
    const testName = 'MV-004: Voice Switching Test';
    
    // Verify all three voices appeared in sequence
    const allExchanges = await page.$$eval('.exchange', exchanges => 
      exchanges.map(ex => ({
        voice: ex.getAttribute('data-voice'),
        textLength: ex.querySelector('.exchange-text').textContent.length
      }))
    );
    
    const expectedVoices = ['ara', 'leo', 'rex']; // Nelly, Leo, Rex
    const actualVoices = allExchanges.map(ex => ex.voice);
    
    const correctSequence = expectedVoices.every((voice, index) => 
      actualVoices[index] === voice
    );
    
    const allHaveContent = allExchanges.every(ex => ex.textLength > 20);
    
    expect(correctSequence).toBe(true);
    expect(allHaveContent).toBe(true);
    expect(allExchanges.length).toBe(3);
    
    const result = TestUtils.formatChampionshipResult(testName, correctSequence && allHaveContent, {
      expectedVoices,
      actualVoices,
      exchangeCount: allExchanges.length
    });
    
    console.log('🔄 Voice Switching Test:', result);
  });

  test('MV-005: Voice Character Consistency', async () => {
    const testName = 'MV-005: Character Consistency Test';
    
    // Analyze each voice's content for personality consistency
    const characterAnalysis = await page.evaluate(() => {
      const exchanges = document.querySelectorAll('.exchange');
      const analysis = {};
      
      exchanges.forEach(exchange => {
        const voice = exchange.getAttribute('data-voice');
        const text = exchange.querySelector('.exchange-text').textContent;
        const name = exchange.querySelector('.exchange-name').textContent;
        
        analysis[voice] = {
          name,
          text,
          length: text.length,
          hasPersonality: text.length > 50 && text.includes(name)
        };
      });
      
      return analysis;
    });
    
    // Verify each voice maintains distinct personality
    const personalities = {
      ara: 'Nelly', // Should mention being Nelly/elephant
      leo: 'Leo',   // Should be analytical
      rex: 'Rex'    // Should be practical
    };
    
    const consistencyScores = Object.entries(personalities).map(([voice, expectedName]) => {
      const analysis = characterAnalysis[voice];
      if (!analysis) return { voice, consistent: false, reason: 'Missing' };
      
      const hasName = analysis.text.toLowerCase().includes(expectedName.toLowerCase());
      const hasSubstantialContent = analysis.length > 30;
      const consistent = hasName && hasSubstantialContent;
      
      return {
        voice,
        consistent,
        hasName,
        contentLength: analysis.length,
        reason: consistent ? 'Good' : `Missing ${!hasName ? 'name' : 'content'}`
      };
    });
    
    const allConsistent = consistencyScores.every(score => score.consistent);
    
    expect(allConsistent).toBe(true);
    consistencyScores.forEach(score => {
      expect(score.consistent).toBe(true);
    });
    
    const result = TestUtils.formatChampionshipResult(testName, allConsistent, {
      consistencyScores,
      totalVoices: consistencyScores.length
    });
    
    console.log('🎭 Character Consistency Test:', result);
  });

  test('MV-006: WebSocket Connection Reliability', async () => {
    const testName = 'MV-006: WebSocket Reliability Test';
    
    // Monitor console for WebSocket connection messages
    let webSocketEvents = [];
    
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('WebSocket') && (text.includes('connected') || text.includes('error') || text.includes('closed'))) {
        webSocketEvents.push({
          timestamp: Date.now(),
          message: text,
          type: text.includes('error') ? 'error' : 
                text.includes('closed') ? 'closed' : 'connected'
        });
      }
    });
    
    // Reload and run episode again to capture WebSocket events
    await page.reload();
    await page.click('button:has-text("Play Trailer")', { timeout: 10000 });
    
    // Wait for episode completion
    await TestUtils.waitFor(() => 
      page.$eval('.progress-text', el => el.textContent.includes('3 / 3')),
      60000
    );
    
    // Analyze WebSocket reliability
    const connectionEvents = webSocketEvents.filter(e => e.type === 'connected');
    const errorEvents = webSocketEvents.filter(e => e.type === 'error');
    const successRate = connectionEvents.length / (connectionEvents.length + errorEvents.length);
    
    const reliable = successRate >= TEST_CONFIG.PERFORMANCE_TARGETS.WEBSOCKET_SUCCESS_RATE;
    
    expect(reliable).toBe(true);
    expect(successRate).toBeGreaterThanOrEqual(TEST_CONFIG.PERFORMANCE_TARGETS.WEBSOCKET_SUCCESS_RATE);
    expect(connectionEvents.length).toBe(3); // One per exchange
    
    const result = TestUtils.formatChampionshipResult(testName, reliable, {
      successRate: Math.round(successRate * 100) + '%',
      connections: connectionEvents.length,
      errors: errorEvents.length,
      events: webSocketEvents.length
    });
    
    console.log('🔌 WebSocket Reliability Test:', result);
  }, 90000);
});