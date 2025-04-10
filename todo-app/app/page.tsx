import styles from "./page.module.css";
import TaskItem from "./components/TaskItem";

export default function Home() {
  return (
    <>
    <header>
      <h1>タスク管理アプリ</h1>
    </header>
    
    <main>
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
