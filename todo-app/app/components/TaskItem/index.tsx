"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Modal from "../Modal";

type Props = {
  title: string
  about: string
  post_date: string
  post_id: number
}

const TaskItem = ({ title, about, post_date, post_id }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  }

  const [isComplete, setIsComplete] = useState<boolean>(() => {
    const saved = localStorage.getItem(`complete:${post_id}`);
    return saved === "true";
  });

  const toggleComplete = () => {
    setIsComplete(prev => {
      const next = !prev;
      localStorage.setItem(`complete:${post_id}`, String(next));
      return next;
    });
  }

  const [message, setMessage] = useState('');
  const deleteItem = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/posts/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post_id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`データ削除 削除ID: ${ data.id }`);
        localStorage.removeItem(`complete:${post_id}`);
        window.location.reload();
      } else {
        setMessage(`エラー: ${ data.error }`);
      }
    } catch (error: any) {
      setMessage(`通信エラー: ${ error.message }`);
    }
  }

  return (
    <>
    <li className={ styles.taskItem } onClick={ toggleModal }>
      <span 
        className={` ${ styles.toggleBtn } ${ isComplete ? styles.completed : '' } `}
        onClick={ (e) => {
          e.stopPropagation();
          toggleComplete();
        } }>{ title }</span>
      
      <p>{ new Date(post_date).toLocaleString() }</p>
      
      <button
        className={ styles.deleteBtn }
        onClick={ (e) => {
          e.stopPropagation();
          deleteItem();
        } }>削除</button>
    </li>
    { message && <p className={ styles.backendMessage }>{ message }</p> }
    
    { isOpen && <Modal toggleModal={ toggleModal } title={ title } about={ about } post_id={ post_id } /> }
    </>
  )
}

export default TaskItem;