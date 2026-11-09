import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// eslint-disable-next-line react-refresh/only-export-components -- entry point has no exports; fast refresh doesn't apply
const AdminApp = lazy(() => import('./admin/AdminApp.tsx'));

const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
if (isAdminRoute) document.title = 'SHY admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={<main className="mx-auto max-w-md px-5 py-24 text-center font-semibold">Loading…</main>}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
);
