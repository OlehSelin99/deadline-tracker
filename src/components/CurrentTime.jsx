import React, { useState, useEffect } from 'react';
import './CurrentTime.css'; // окремий css для часу (не обов'язково, але можемо створити)

function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="current-time">
      Поточний час: {formattedTime}
    </div>
  );
}

export default CurrentTime;