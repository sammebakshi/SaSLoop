window.onerror = function (message, source, lineno, colno, error) {
  const errorInfo = {
    message,
    source,
    lineno,
    colno,
    stack: error && error.stack ? error.stack : 'No stack trace available'
  };
  fetch(`${API_BASE}/api/pos/log-error`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorInfo)
  }).catch(() => {});

  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'black';
  div.style.color = 'red';
  div.style.padding = '20px';
  div.style.fontFamily = 'monospace';
  div.style.zIndex = '999999';
  div.style.overflow = 'auto';
  div.innerHTML = `<h1>Uncaught Error: ${message}</h1>
  <p>Source: ${source}</p>
  <p>Line: ${lineno}, Col: ${colno}</p>
  <pre>${error && error.stack ? error.stack : 'No stack trace available'}</pre>`;
  document.body.appendChild(div);
  return false;
};

window.addEventListener('unhandledrejection', function (event) {
  // Skip Axios/network errors — these are handled by app-level try-catch
  if (event.reason && (event.reason.isAxiosError || event.reason.response || event.reason.code === 'ERR_NETWORK')) {
    return;
  }

  const errorInfo = {
    message: event.reason && event.reason.message ? event.reason.message : 'Unhandled Promise Rejection',
    stack: event.reason && event.reason.stack ? event.reason.stack : String(event.reason)
  };
  fetch(`${API_BASE}/api/pos/log-error`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorInfo)
  }).catch(() => {});

  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'black';
  div.style.color = 'orange';
  div.style.padding = '20px';
  div.style.fontFamily = 'monospace';
  div.style.zIndex = '999999';
  div.style.overflow = 'auto';
  div.innerHTML = `<h1>Unhandled Promise Rejection</h1>
  <pre>${event.reason && event.reason.stack ? event.reason.stack : event.reason}</pre>`;
  document.body.appendChild(div);
});

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { API_BASE } from './services/api'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
