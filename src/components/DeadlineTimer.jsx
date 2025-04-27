import React, { useState, useEffect } from 'react';
import './DeadlineTimer.css';

function DeadlineTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState('');

  const calculateTimeLeft = () => {
    if (!deadline) return '';

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return 'Час вичерпано!';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    return `Залишилось: ${days}д ${hours}г ${minutes}хв`;
  };

  useEffect(() => {
    if (!deadline) return;

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Оновлювати кожну хвилину

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className={`deadline-timer ${timeLeft === 'Час вичерпано!' ? 'overdue' : ''}`}>
      {timeLeft}
    </div>
  );
}

export default DeadlineTimer;