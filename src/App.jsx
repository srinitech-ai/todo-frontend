import React, { useState, useEffect } from "react";

const API_BASE = "http://65.0.106.245:3000/api" || "/api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/todos`).then(r => r.json()).then(setTodos);
  }, []);

  const add = async e => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    const newTodo = await res.json();
    setTodos([newTodo, ...todos]);
    setText("");
  };

  const toggle = async t => {
    await fetch(`${API_BASE}/todos/${t.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !t.done })
    });
    setTodos(todos.map(x => x.id === t.id ? { ...x, done: !x.done } : x));
  };

  const del = async id => {
    await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(x => x.id !== id));
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Todo App</h1>
      <form onSubmit={add}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add task" />
        <button>Add</button>
      </form>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t)} />
            <span style={{ textDecoration: t.done ? "line-through" : "none", marginLeft: 8 }}>
              {t.text}
            </span>
            <button onClick={() => del(t.id)} style={{ marginLeft: 8 }}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
