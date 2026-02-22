
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * SPA REDIRECT HANDLER
 * Captured from 404.html redirects to handle SEO-friendly URLs on environments
 * that don't natively support SPA routing. This restores the original path
 * into the browser history before React Router initializes.
 */
(function handleRedirect() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get('p');
    if (redirectPath) {
      // Decode the path (reversing the -- to / transformation from 404.html)
      const originalPath = '/' + redirectPath.replace(/--/g, '/');
      
      // Construct clean URL without the 'p' parameter
      const cleanUrl = originalPath + window.location.hash;
      
      // Update browser history silently
      window.history.replaceState(null, '', cleanUrl);
    }
  } catch (e) {
    console.error('Redirect restoration failed:', e);
  }
})();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
