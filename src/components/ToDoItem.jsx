import React, { useState } from 'react';
import './ToDoItem.css';
import ToDoOptions from './ToDoOptions';
import DeadlineTimer from './DeadlineTimer';

function ToDoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);
  const [newDeadline, setNewDeadline] = useState(todo.deadline || '');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTextChange = (e) => {
    setNewText(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setNewDeadline(e.target.value);
  };

  const handleBlur = () => {
    if (newText.trim() !== '') {
      onEdit(newText, newDeadline);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <li className="todo-item">
      <div className="todo-content">
        {isEditing ? (
          <>
            <input
              type="text"
              value={newText}
              onChange={handleTextChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="edit-input"
              placeholder="Новий текст..."
            />
            <input
              type="date"
              value={newDeadline}
              onChange={handleDeadlineChange}
              onBlur={handleBlur}
              className="edit-deadline"
            />
          </>
        ) : (
          <>
            <span
              onDoubleClick={handleDoubleClick}
              className={todo.completed ? 'completed' : ''}
            >
              {todo.text}
            </span>
            {todo.deadline && (
              <>
                <div className="deadline">
                  Виконати до: {todo.deadline}
                </div>
                <DeadlineTimer deadline={todo.deadline} />
              </>
            )}
          </>
        )}
      </div>

      <ToDoOptions
        onToggle={onToggle}
        onEditStart={() => setIsEditing(true)}
        onDelete={onDelete}
        completed={todo.completed}
      />
    </li>
  );
}

export default ToDoItem;


