import React from 'react';
import DynamicBackground from './layouts/DynamicBackground';
import ScrollToTop from './utils/ScrollToTop';
import CustomRoutes from './routes/CustomRoutes';


function App() {
  return (
    <DynamicBackground>
      <ScrollToTop>
        <CustomRoutes />
      </ScrollToTop>
    </DynamicBackground>
  );
}

export default App;
