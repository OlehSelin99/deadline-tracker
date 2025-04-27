import React from 'react';
import { Radio } from 'antd';
import styles from './styles.module.css';

interface ToDoOptionsProps {
  filter: 'all' | 'completed' | 'incomplete';
  onFilterChange: (filter: 'all' | 'completed' | 'incomplete') => void;
}

export const ToDoOptions: React.FC<ToDoOptionsProps> = ({ filter, onFilterChange }) => {
  return (
    <div className={styles.todoOptions}>
      <Radio.Group
        value={filter}
        onChange={e => onFilterChange(e.target.value)}
        buttonStyle="solid"
        optionType="button"
      >
        <Radio.Button value="all">Усі</Radio.Button>
        <Radio.Button value="completed">Виконані</Radio.Button>
        <Radio.Button value="incomplete">Невиконані</Radio.Button>
      </Radio.Group>
    </div>
  );
};
