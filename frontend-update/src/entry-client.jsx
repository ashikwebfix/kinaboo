import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (container && container.hasChildNodes() && container.innerHTML.trim() !== '<!--app-html-->' && container.innerHTML.trim() !== '') {
  try {
    ReactDOM.hydrateRoot(container, app);
  } catch (e) {
    ReactDOM.createRoot(container).render(app);
  }
} else if (container) {
  ReactDOM.createRoot(container).render(app);
}
