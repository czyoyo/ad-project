import './App.css';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store.ts'; // 🔥 persistor 추가 임포트
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { JSX } from 'react';
import AppRoutes from './routes';
import { PersistGate } from 'redux-persist/integration/react'; // 🔥 PersistGate 컴포넌트 임포트

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <Router>
                <AppRoutes />
              </Router>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
