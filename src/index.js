import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';

const container = document.getElementById('root');
const tree = (
  <>
    <App />
    <Analytics />
  </>
);

// The page is pre-rendered at build time so search engines see real content.
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, tree);
} else {
  ReactDOM.createRoot(container).render(tree);
}
