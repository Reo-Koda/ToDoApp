"use client";
import { useState } from "react";
import styles from "./styles.module.css";

type Props = {
  userName: string
  password: string
}

const UserItem = ({ userName, password }: Props) => {
  const [message, setMessage] = useState('');

  const deleteUser = async (userName: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`ユーザー削除 削除ユーザー: ${ data.id }`);
        window.location.reload();
      } else {
        setMessage(`エラー: ${ data.error }`);
      }
    } catch (error: any) {
      setMessage(`通信エラー: ${ error.message }`);
    }
  }

  return (
    <div className={ styles.userBox }>
      <div className={ styles.userContainer }>
        <h2>{ userName }</h2>
        <h3>{ password }</h3>
        { message && <p className={ styles.backendMessage }>{ message }</p> }
      </div>
      <button
        className={ styles.deleteBtn }
        onClick={ () => deleteUser(userName) }>削除</button>
    </div>
  )
}

export default UserItem;