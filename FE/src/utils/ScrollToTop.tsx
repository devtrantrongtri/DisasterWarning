// ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  children: React.ReactNode;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Hoặc 'smooth' nếu bạn muốn hiệu ứng cuộn mượt
    });
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;
