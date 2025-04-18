"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import TaskItem from "./components/TaskItem";
import Modal from "./components/Modal";

interface Post {
  title: string;
  about: string;
  post_date: string;
  post_id: number;
}

export default function Home() {
  const router = useRouter();
  // const [statusData, setStatusData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState<Post[]>([]);
  const [message, setMessage] = useState('');

  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push('/signin');
    } else {
      setUserName(token);
    }
  }, [])

  // useEffect(() => {
  //   fetch("http://localhost:8000/api/status")
  //   .then((res) => res.json())
  //   .then((json) => setStatusData(json))
  //   .catch((err) => console.error("Error:", err));
  // }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/users")
    .then((res) => res.json())
    .then((json) => setUserData(json.users))
    .catch((err) => console.error("Error:", err));
  }, [])

  useEffect(() => {
    fetch("http://localhost:8000/api/posts")
    .then((res) => res.json())
    .then((json) => setPostData(json.posts))
    .catch((err) => console.error("Error:", err));
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:8000/api/posts/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,
          title: title,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`データ追加 新規ID: ${ data.id }`);
        window.location.reload();
      } else {
        setMessage(`エラー: ${ data.error }`);
      }
    } catch (error: any) {
      setMessage(`通信エラー: ${ error.message }`);
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken");
    router.push('/signin');
  }

  return (
    <>
    <div className={ styles.imgBox } onClick={ logout }>
      <img className={ styles.logoutImg } src="/door.svg" alt="logoutImg" />
      <p className={ styles.logoutTxt }>ログアウト</p>
    </div>
    <div className={ styles.imgBox2 } onClick={ toggleModal }>
      <img className={ styles.logoutImg } src="/option.svg" alt="logoutImg" />
      <p className={ styles.logoutTxt }>管理者</p>
    </div>
    { isOpen && <Modal  toggleModal={ toggleModal } users={ userData }/> }

    <h2 className={ styles.projectTitle }>{ userName ? `${ userName } プロジェクト` : "ログイン画面に遷移します..."}</h2>
    
    <main>
      {/* { statusData ? <pre>{JSON.stringify(statusData, null, 1)}</pre> : "Now Loading..." } */}
      <form className={ styles.taskForm } onSubmit={ handleSubmit }>
        <input
          type="text"
          className={ styles.taskInput }
          placeholder="新しいタスクを入力"
          value={ title }
          onChange={(e) => setTitle(e.target.value)}
          required />
        <button type="submit" className={ styles.addTask }>追加</button>
      </form>
      {/* { postData ? <pre>{JSON.stringify(postData, null, 1)}</pre> : "Now Loading..." } */}
      { message && <pre className={ styles.message }>{ message }</pre> }
      
      <ul className={ styles.taskList }>
        {/* タスクがここに追加される */}
        { postData && postData.map((data) => {
          return(
            <TaskItem title={ data.title } about={ data.about } post_date={ data.post_date } post_id={ data.post_id } key={ data.post_id } />
          )
        }) }
      </ul>
    </main>
  </>
  );
}
