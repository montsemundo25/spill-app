import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import faviconUrl from './assets/favicon-spill.svg';

const faviconLink = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
if (faviconLink) faviconLink.href = faviconUrl;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
