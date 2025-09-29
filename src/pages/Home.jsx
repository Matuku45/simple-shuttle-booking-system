import React, { useState, useEffect } from 'react';
import img1 from '../components/imgs/picture1.webp';
import img2 from '../components/imgs/picture2.webp';
import img3 from '../components/imgs/picture3.webp';
import About from './About';

const images = [img1, img2, img3];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(false);

  // Auto-slide effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setError(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [current, error]);

  const handleError = () => {
    setError(true);
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <>
    <About />
    
    </>
  );
};

export default Home;
