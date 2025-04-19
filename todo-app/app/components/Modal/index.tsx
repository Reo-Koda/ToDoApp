"use client";
import { useState, FormEvent } from "react";
import styles from "./styles.module.css";
import UserItem from "../UserItem";

type Props = {
  toggleModal: () => void
  users?: User[] | null
  title?: string
  about?: string
  post_id?: number
}

type User = {
  user_name: string
  password: string
}

const Modal = ({ toggleModal, users, title, about, post_id }: Props) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newAbout, setNewAbout] = useState(about);

  const [isEdit, setIsEdit] = useState(false);
  const toggleEdit = () => {
    setIsEdit(!isEdit);
  }

  const [message, setMessage] = useState('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTitle === title && newAbout === about) {
      setMessage('変更を確認できませんでした');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/posts/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          about: newAbout,
          post_id: post_id
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`データ変更 変更ID: ${ data.id }`);
        window.location.reload();
      } else {
        setMessage(`エラー: ${ data.error }`);
      }
    } catch (error: any) {
      setMessage(`通信エラー: ${ error.message }`);
    }
  }

  return (
    <div className={ styles.overlay } onClick={ toggleModal }>
      <div className={ styles.container } onClick={ (e) => e.stopPropagation() }>
        { users && <h2 className={ styles.viewTitle }>管理者画面</h2> }
        { users && users.map((data, index) => {
          return(
            <UserItem userName={ data.user_name } password={ data.password } key={ index } />
          )
        }) }
        { title &&
          <>
          { isEdit ?
            <form className={ styles.editBox } onSubmit={ handleSubmit }>
              <input
                type="text"
                className={ styles.inputTitle }
                value={ newTitle }
                onChange={(e) => setNewTitle(e.target.value)}
                required />
              <textarea
                className={ styles.inputAbout }
                placeholder="詳細説明を入力"
                value={ newAbout }
                onChange={(e) => setNewAbout(e.target.value)} />
              <button type="submit" className={ styles.editBtn }>変更</button>
              { message && <p className={ styles.backendMessage }>{ message }</p> }
            </form>
            :
            <div className={ styles.editBox }>
              <h2 className={ styles.viewTitle }>{ title }</h2>
              <p className={ styles.viewAbout }>{ about }</p>
              <button className={ styles.editBtn } onClick={ toggleEdit }>編集</button>
            </div>
          }
          </>
        }
      </div>
    </div>
  )
}

export default Modal;