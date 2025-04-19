"use client";
import { useState, FormEvent } from "react";
import styles from "./styles.module.css";

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
        toggleEdit();
        window.location.reload();
      } else {
        setMessage(`エラー: ${ data.error }`);
      }
    } catch (error: any) {
      setMessage(`通信エラー: ${ error.message }`);
    }
  }

  const deleteUser = async (users: User) => {
    if (!users) return;

    try {
      const res = await fetch('http://localhost:8000/api/users/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: users.user_name,
          password: users.password,
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
    <div className={ styles.overlay } onClick={ toggleModal }>
      <div className={ styles.container } onClick={ (e) => e.stopPropagation() }>
        { users && <h2 className={ styles.viewTitle }>管理者画面</h2> }
        { users && users.map((data, index) => {
          return(
            <div className={ styles.userBox } key={ index }>
              <div className={ styles.userContainer }>
                <h2>{ data.user_name }</h2>
                <h3>{ data.password }</h3>
                { message && <p className={ styles.backendMessage }>{ message }</p> }
              </div>
              <button
                className={ styles.deleteBtn }
                onClick={ () => deleteUser(data) }>削除</button>
            </div>
          )
        })
        }
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