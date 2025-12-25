import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import * as Sentry from "@sentry/react";
import './index.css';

console.log("Starting application...");

Sentry.init({
  dsn: "https://placeholder-dsn@sentry.io/123456",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">⚠️ Critical App Crash</div>}>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log("App mounted successfully.");
} catch (e) {
  console.error("Mounting error:", e);
}