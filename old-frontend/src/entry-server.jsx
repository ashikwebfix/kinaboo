import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async';

export function render(url) {
  const helmetContext = {};
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <HelmetProvider context={helmetContext}>
          <App />
        </HelmetProvider>
      </StaticRouter>
    </React.StrictMode>
  );
  return { html, helmetContext };
}
