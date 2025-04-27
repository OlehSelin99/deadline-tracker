import React, { useState, useEffect } from "react";
import ToDoItem from "../components/ToDoItem";
import CurrentTime from "../components/CurrentTime"; // Імпортуємо новий компонент
import "./Home.css";

function Home() {
  const [deadline, setDeadline] = useState("");
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { text: input, completed: false, deadline: deadline }
    ]);
    setInput('');
    setDeadline('');
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const editTodo = (index, newText) => {
    const newTodos = [...todos];
    newTodos[index].text = newText;
    setTodos(newTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true;
  });

  return (
    <div className="home-container">
      <h1 className="home-title">Мій To-Do List</h1>

      {/* Поточний час в окремому компоненті */}
      <CurrentTime />

      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Нова справа..."
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="date-input"
        />
        <button onClick={addTodo}>Додати</button>
      </div>

      <div className="filter-group">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          Усі
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Виконані
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className={filter === "incomplete" ? "active" : ""}
        >
          Невиконані
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <ToDoItem
            key={index}
            todo={todo}
            onToggle={() => toggleTodo(index)}
            onDelete={() => deleteTodo(index)}
            onEdit={(newText) => editTodo(index, newText)}
          />
        ))}
      </ul>
    </div>
  );
}

export default Home;
