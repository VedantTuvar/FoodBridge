import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './router';
import './styles/global.css';

export const App = () => {
  return (
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  );
};

export default App;
