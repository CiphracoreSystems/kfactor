/**
 * Debug Logger for K-Factor Calculator
 * Tracks all user interactions and app responses
 */

class DebugLogger {
  constructor() {
    this.logs = [];
    this.sessionId = Date.now();
    
    // Auto-enable on localhost for development
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    this.isEnabled = isLocalhost || localStorage.getItem('debugMode') === 'true';
    
    // Create debug panel
    if (this.isEnabled) {
      this.createDebugPanel();
      this.attachEventListeners();
      this.log('Session started', { 
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
        autoEnabled: isLocalhost
      });
    }
  }

  createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'debugPanel';
    panel.innerHTML = `
      <style>
        #debugPanel {
          position: fixed;
          bottom: 10px;
          left: 10px;
          right: 10px;
          max-width: 90vw;
          max-height: 300px;
          background: rgba(0, 0, 0, 0.95);
          color: #0f0;
          font-family: monospace;
          font-size: 10px;
          border: 2px solid #0f0;
          border-radius: 5px;
          z-index: 10000;
          padding: 10px;
          overflow-y: auto;
          box-shadow: 0 0 20px #0f0;
        }
        #debugPanel h3 {
          margin: 0 0 10px 0;
          color: #0f0;
          font-size: 12px;
        }
        #debugLog {
          max-height: 300px;
          overflow-y: auto;
          border-top: 1px solid #0f0;
          padding-top: 5px;
        }
        .debug-entry {
          margin-bottom: 5px;
          padding: 2px;
          border-left: 2px solid #0f0;
          padding-left: 5px;
        }
        .debug-timestamp {
          color: #888;
        }
        .debug-action {
          color: #ff0;
        }
        .debug-data {
          color: #0ff;
          margin-left: 10px;
        }
        #debugControls {
          margin-top: 10px;
          border-top: 1px solid #0f0;
          padding-top: 5px;
        }
        #debugControls button {
          background: #0f0;
          color: #000;
          border: none;
          padding: 3px 8px;
          margin-right: 5px;
          cursor: pointer;
          font-size: 10px;
        }
        #debugControls button:hover {
          background: #0a0;
        }
      </style>
      <h3>🔍 Debug Logger</h3>
      <div id="debugLog"></div>
      <div id="debugControls">
        <button onclick="debugLogger.clear()">Clear</button>
        <button onclick="debugLogger.export()">Export</button>
        <button onclick="debugLogger.copyLast()">Copy Last</button>
        <button onclick="debugLogger.disable()">Disable</button>
      </div>
    `;
    document.body.appendChild(panel);
    this.logContainer = document.getElementById('debugLog');
  }

  attachEventListeners() {
    // Track all input changes
    document.addEventListener('input', (e) => {
      if (e.target.id) {
        this.log('Input changed', {
          field: e.target.id,
          value: e.target.value,
          type: e.target.type
        });
      }
    });

    // Track all select changes
    document.addEventListener('change', (e) => {
      if (e.target.tagName === 'SELECT') {
        this.log('Select changed', {
          field: e.target.id,
          value: e.target.value,
          text: e.target.options[e.target.selectedIndex]?.text
        });
      }
    });

    // Track all button clicks
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
        this.log('Button clicked', {
          text: e.target.textContent,
          onclick: e.target.getAttribute('onclick')
        });
      }
    });

    // Track calculation results
    const originalCalculate = window.calculate;
    window.calculate = () => {
      this.log('Calculate triggered', {
        inputs: {
          thickness: document.getElementById('thickness')?.value,
          thicknessUnit: document.getElementById('thicknessUnit')?.value,
          bendRadius: document.getElementById('bendRadius')?.value,
          radiusUnit: document.getElementById('radiusUnit')?.value,
          bendAngle: document.getElementById('bendAngle')?.value,
          material: document.getElementById('material')?.value,
          materialText: document.getElementById('material')?.options[document.getElementById('material')?.selectedIndex]?.text
        }
      });
      
      // Call original function
      originalCalculate();
      
      // Log results
      setTimeout(() => {
        this.log('Calculate completed', {
          results: {
            BA: document.getElementById('resultBA')?.textContent,
            BD: document.getElementById('resultBD')?.textContent,
            kFactor: document.getElementById('kFactorDisplay')?.textContent,
            neutral: document.getElementById('resultNeutral')?.textContent,
            recommendation: document.getElementById('radiusRecommendation')?.textContent
          }
        });
        
        // Check diagram
        const svg = document.getElementById('bendDiagram');
        if (svg) {
          const paths = svg.querySelectorAll('path');
          this.log('Diagram rendered', {
            pathCount: paths.length,
            svgWidth: svg.getAttribute('width'),
            svgHeight: svg.getAttribute('height'),
            viewBox: svg.getAttribute('viewBox'),
            innerHTML: svg.innerHTML.substring(0, 200) + '...'
          });
        }
      }, 100);
    };

    // Track diagram drawing
    const originalDrawDiagram = window.drawDiagram;
    window.drawDiagram = (R, T, angle, kFactor) => {
      this.log('DrawDiagram called', {
        R: R,
        T: T,
        angle: angle,
        kFactor: kFactor,
        finalScale: window.finalScale || 'unknown'
      });
      
      // Call original function
      originalDrawDiagram(R, T, angle, kFactor);
    };

    // Track window resize
    window.addEventListener('resize', () => {
      this.log('Window resized', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    });

    // Track errors
    window.addEventListener('error', (e) => {
      this.log('ERROR', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        col: e.colno
      });
    });
  }

  log(action, data = {}) {
    if (!this.isEnabled) return;
    
    const entry = {
      timestamp: new Date().toISOString(),
      action: action,
      data: data
    };
    
    this.logs.push(entry);
    
    // Update UI
    if (this.logContainer) {
      const entryEl = document.createElement('div');
      entryEl.className = 'debug-entry';
      entryEl.innerHTML = `
        <span class="debug-timestamp">${new Date().toLocaleTimeString()}</span>
        <span class="debug-action">${action}</span>
        ${Object.keys(data).length > 0 ? 
          `<div class="debug-data">${JSON.stringify(data, null, 2)}</div>` : ''}
      `;
      this.logContainer.appendChild(entryEl);
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }
    
    // Also log to console
    console.log(`[DEBUG] ${action}`, data);
  }

  clear() {
    this.logs = [];
    if (this.logContainer) {
      this.logContainer.innerHTML = '';
    }
    this.log('Logs cleared');
  }

  export() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], 
      { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-log-${this.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.log('Logs exported');
  }

  copyLast() {
    if (this.logs.length > 0) {
      const lastLog = this.logs[this.logs.length - 1];
      navigator.clipboard.writeText(JSON.stringify(lastLog, null, 2));
      this.log('Last log copied to clipboard');
    }
  }

  disable() {
    localStorage.setItem('debugMode', 'false');
    const panel = document.getElementById('debugPanel');
    if (panel) {
      panel.remove();
    }
    this.isEnabled = false;
  }

  enable() {
    localStorage.setItem('debugMode', 'true');
    this.isEnabled = true;
    this.createDebugPanel();
    this.attachEventListeners();
  }
}

// Initialize logger
const debugLogger = new DebugLogger();

// Add console command to enable debugging
console.log('%c📍 Debug Mode: Type debugLogger.enable() to start logging', 
  'color: #0f0; font-weight: bold; font-size: 14px');