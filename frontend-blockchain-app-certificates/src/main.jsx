import React from 'react'
import ReactDOM from 'react-dom/client'
import { UserHashProvider } from './contexts/UserHashContext';
import App from './App.jsx'
import './index.css'
import '@fontsource/roboto/400.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserHashProvider>
      <App />
    </UserHashProvider>
  </React.StrictMode>,
)
