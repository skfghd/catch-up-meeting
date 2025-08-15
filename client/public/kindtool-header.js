(function() {
  'use strict';
  
  // Avoid multiple execution
  if (window.kindtoolHeaderLoaded) return;
  window.kindtoolHeaderLoaded = true;

  // Configuration
  const CONFIG = {
    domain: 'https://kindtool.ai',
    headerHeight: '60px',
    zIndex: 9999
  };

  // CSS styles for the header
  const styles = `
    .kindtool-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: ${CONFIG.headerHeight};
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      z-index: ${CONFIG.zIndex};
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-sizing: border-box;
    }
    
    .kindtool-logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
      text-decoration: none;
      color: white;
    }
    
    .kindtool-logo:hover {
      opacity: 0.9;
    }
    
    .kindtool-icon {
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 6px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: #667eea;
    }
    
    .kindtool-nav {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .kindtool-nav a {
      color: white;
      text-decoration: none;
      font-size: 14px;
      padding: 8px 16px;
      border-radius: 20px;
      transition: background-color 0.2s;
    }
    
    .kindtool-nav a:hover {
      background: rgba(255,255,255,0.1);
    }
    
    .kindtool-cta {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
    }
    
    .kindtool-cta:hover {
      background: rgba(255,255,255,0.3);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .kindtool-header {
        padding: 0 16px;
      }
      
      .kindtool-nav {
        gap: 12px;
      }
      
      .kindtool-nav a {
        font-size: 13px;
        padding: 6px 12px;
      }
    }
    
    /* Adjust body padding to prevent content overlap */
    body {
      padding-top: calc(${CONFIG.headerHeight} + 80px) !important;
      margin-top: 0 !important;
    }
    
    /* Ensure existing navigation is pushed down */
    nav.glass-effect,
    nav[class*="glass-effect"] {
      top: ${CONFIG.headerHeight} !important;
    }
    
    /* Fix for any fixed positioned navs */
    nav.fixed {
      top: ${CONFIG.headerHeight} !important;
    }
  `;

  // Create and inject styles
  function injectStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Create header element
  function createHeader() {
    const header = document.createElement('div');
    header.className = 'kindtool-header';
    header.innerHTML = `
      <a href="${CONFIG.domain}" class="kindtool-logo" target="_blank">
        <div class="kindtool-icon">🧠</div>
        KindTool
      </a>
      <nav class="kindtool-nav">
        <a href="${CONFIG.domain}/survey" target="_blank">MBTI 진단</a>
        <a href="${CONFIG.domain}/rooms" target="_blank">미팅 참여</a>
        <a href="${CONFIG.domain}" class="kindtool-cta" target="_blank">시작하기</a>
      </nav>
    `;
    return header;
  }

  // Initialize the header
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      injectStyles();
      const header = createHeader();
      document.body.insertBefore(header, document.body.firstChild);
      
      // Log successful integration
      console.log('KindTool header integrated successfully');
    } catch (error) {
      console.error('KindTool header integration failed:', error);
    }
  }

  // Start initialization
  init();
})();