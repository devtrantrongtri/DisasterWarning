import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './stores/store.ts'

import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './utils/them.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>  
          <App />
        </Router>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
