import './App.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import React from 'react';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
              <Routes />
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
