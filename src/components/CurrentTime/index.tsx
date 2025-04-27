import React, { useState, useEffect } from 'react';
import { ClockCircleOutlined } from '@ant-design/icons';
import styles from './styles.module.css';

export const CurrentTime: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.currentTime}>
      <div className={styles.currentTimeText}>Поточний час</div>
      <ClockCircleOutlined style={{ fontSize: '1.2rem', color: '#2196F3' }} />
      <span className={styles.time}>{time}</span>
    </div>
  );
};
