import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './index.css'
import CustomRoutes from './routes/CustomRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <CustomRoutes/>
    </>
  )
}

export default App
