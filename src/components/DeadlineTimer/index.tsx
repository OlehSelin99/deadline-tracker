import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface DeadlineTimerProps {
  deadline: string;
  completed?: boolean;
}

export const DeadlineTimer: React.FC<DeadlineTimerProps> = ({ deadline, completed }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [completionTime, setCompletionTime] = useState<string | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const difference = deadlineDate.getTime() - now.getTime();

      if (difference <= 0) {
        return 'Дедлайн минув';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      let timeString = '';

      if (days > 0) {
        timeString += `${days} ${getDayWord(days)} `;
      }
      if (hours > 0 || days > 0) {
        timeString += `${hours} ${getHourWord(hours)} `;
      }
      if (minutes > 0 || hours > 0 || days > 0) {
        timeString += `${minutes} ${getMinuteWord(minutes)} `;
      }
      if (seconds > 0 || minutes === 0) {
        timeString += `${seconds} ${getSecondWord(seconds)}`;
      }

      return timeString.trim();
    };

    const getDayWord = (days: number): string => {
      if (days % 10 === 1 && days % 100 !== 11) return 'день';
      if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дні';
      return 'днів';
    };

    const getHourWord = (hours: number): string => {
      if (hours % 10 === 1 && hours % 100 !== 11) return 'година';
      if ([2, 3, 4].includes(hours % 10) && ![12, 13, 14].includes(hours % 100)) return 'години';
      return 'годин';
    };

    const getMinuteWord = (minutes: number): string => {
      if (minutes % 10 === 1 && minutes % 100 !== 11) return 'хвилина';
      if ([2, 3, 4].includes(minutes % 10) && ![12, 13, 14].includes(minutes % 100))
        return 'хвилини';
      return 'хвилин';
    };

    const getSecondWord = (seconds: number): string => {
      if (seconds % 10 === 1 && seconds % 100 !== 11) return 'секунда';
      if ([2, 3, 4].includes(seconds % 10) && ![12, 13, 14].includes(seconds % 100))
        return 'секунди';
      return 'секунд';
    };

    // Якщо завдання виконане і час виконання ще не збережено
    if (completed && !completionTime) {
      const currentTime = calculateTimeLeft();
      setCompletionTime(currentTime);
      setTimeLeft(currentTime);
      return;
    }

    // Якщо завдання виконане і час вже збережено
    if (completed && completionTime) {
      setTimeLeft(completionTime);
      return;
    }

    // Якщо завдання не виконане
    const updateTimer = () => {
      const currentTime = calculateTimeLeft();
      setTimeLeft(currentTime);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [deadline, completed, completionTime]);

  return (
    <div className={styles.deadlineTimer}>
      <div className={styles.deadlineContent}>
        <span className={styles.deadlineLabel}>
          {timeLeft === 'Дедлайн минув' ? 'Статус: ' : 'Залишилось: '}
        </span>
        <span
          className={`${styles.deadlineTime} ${timeLeft === 'Дедлайн минув' ? styles.overdue : ''}`}
        >
          {timeLeft}
        </span>
      </div>
    </div>
  );
};
