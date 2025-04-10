"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Modal from "../Modal";

const TaskItem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  }

  const [isComplete, setIsComplete] = useState(false);
  const toggleComplete = () => {
    setIsComplete(!isComplete);
  }

  return (
    <>
    <li className={ styles.taskItem } onClick={ toggleModal }>
      <span 
        className={` ${ styles.toggleBtn } ${ isComplete ? styles.completed : '' } `}
        onClick={ (e) => {
          e.stopPropagation();
          toggleComplete();
        } }>宿題</span>
      <button className={ styles.deleteBtn } onClick={ (e) => e.stopPropagation() }>削除</button>
    </li>
    { isOpen && <Modal toggleModal={ toggleModal } /> }
    
    </>
  )
}

export default TaskItem;