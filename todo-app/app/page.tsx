"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import TaskItem from "./components/TaskItem";


export default function Home() {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/status")
    .then((res) => res.json())
    .then((json) => setData(json))
    .catch((err) => console.error("Error:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/users")
    .then((res) => res.json())
    .then((json) => setUserData(json))
    .catch((err) => console.error("Error:", err));
  })

  return (
    <>
    <header>
      <h1>タスク管理アプリ</h1>
    </header>
    
    <main>
      {data ? <pre>{JSON.stringify(data, null, 1)}</pre> : "Loading..."}
      {userData ? <pre>{JSON.stringify(userData, null, 1)}</pre> : "Loading..."}
      <form className={ styles.taskForm }>
        <input type="text" className={ styles.taskInput } placeholder="新しいタスクを入力" required />
        <button type="submit" className={ styles.addTask }>追加</button>
      </form>
      
      <ul className={ styles.taskList } id="task-list">
        {/* タスクがここに追加される */}
        <TaskItem />
      </ul>
    </main>
  </>
  );
}
