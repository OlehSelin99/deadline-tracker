import React from 'react';
import './ToDoOptions.css';

function ToDoOptions({ onToggle, onEditStart, onDelete, completed }) {
  return (
    <div className="todo-options">
      <button onClick={onToggle} className="option-button">
        {completed ? 'Скасувати' : 'Виконано'}
      </button>
      <button onClick={onEditStart} className="option-button">
        Редагувати
      </button>
      <button onClick={onDelete} className="option-button delete">
        Видалити
      </button>
    </div>
  );
}

export default ToDoOptions;