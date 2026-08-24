import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

const container = document.getElementById('root');
const rootContent = container.innerHTML.trim();

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (rootContent === '<!--app-html-->' || rootContent === '') {
  createRoot(container).render(app);
} else {
  hydrateRoot(container, app);
}
