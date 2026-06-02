import { useMemo } from 'react';
import { useAppSelector } from './app/hooks';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  const theme = useAppSelector((state) => state.settings.theme);
  const themeClass = useMemo(() => (theme === 'dark' ? 'dark' : 'light'), [theme]);

  return (
    <div className={`${themeClass} min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100`}>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  );
}

export default App;
