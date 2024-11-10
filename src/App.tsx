import { useState } from 'react'
import reactLogo from './assets/logo.svg'
// import viteLogo from '/vite.svg'
import './index.css'
import CustomRoutes from './routes/CustomRoutes'
import ScrollToTop from './utils/ScrollToTop'

function App() {

  return (
    <ScrollToTop>
    <CustomRoutes />
  </ScrollToTop>
  )
}

export default App
