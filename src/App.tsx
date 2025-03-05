import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { JSX } from 'react';
import AppRoutes from './routes';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
              <AppRoutes />
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;
