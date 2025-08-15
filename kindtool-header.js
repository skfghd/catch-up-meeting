// KindTool Header Script for External App Integration
// This script creates a branded header for external applications

(function() {
  'use strict';
  
  // Create the header element
  const header = document.createElement('div');
  header.id = 'kindtool-header';
  header.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    padding: 0 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 18px;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-bottom: 1px solid rgba(255,255,255,0.1);
  `;
  
  // Create logo and brand
  const logo = document.createElement('div');
  logo.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  const logoIcon = document.createElement('div');
  logoIcon.style.cssText = `
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
  `;
  logoIcon.textContent = 'K';
  
  const brandText = document.createElement('span');
  brandText.textContent = 'KindTool';
  brandText.style.cssText = `
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.5px;
  `;
  
  // Create tagline
  const tagline = document.createElement('span');
  tagline.textContent = 'AI-Powered Team Communication';
  tagline.style.cssText = `
    margin-left: 20px;
    font-size: 14px;
    font-weight: 400;
    opacity: 0.8;
    display: none;
  `;
  
  // Show tagline on larger screens
  if (window.innerWidth > 768) {
    tagline.style.display = 'inline';
  }
  
  // Assemble header
  logo.appendChild(logoIcon);
  logo.appendChild(brandText);
  header.appendChild(logo);
  header.appendChild(tagline);
  
  // Add body padding to prevent content overlap
  function adjustBodyPadding() {
    if (document.body) {
      document.body.style.paddingTop = '60px';
    }
  }
  
  // Insert header when DOM is ready
  function insertHeader() {
    if (document.body) {
      document.body.insertBefore(header, document.body.firstChild);
      adjustBodyPadding();
    } else {
      setTimeout(insertHeader, 10);
    }
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertHeader);
  } else {
    insertHeader();
  }
  
  // Handle window resize for responsive tagline
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      tagline.style.display = 'inline';
    } else {
      tagline.style.display = 'none';
    }
  });
  
})();