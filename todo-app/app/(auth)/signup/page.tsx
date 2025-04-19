"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import WarnContainer from "../../components/WarnContainer";

const SignUp = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userName, password: password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        
        setMessage(`サインイン成功: ${data.message}`);
        router.push('/');
      } else {
        setMessage(`エラー: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`通信エラー: ${error.message}`);
    }
  };

  return (
    <>
    <h2 className={ styles.title }>新規登録</h2>
    <form onSubmit={ handleSubmit } className={ styles.inputContainer }>
      <input
        className={ styles.inputbox }
        type="text"
        placeholder="ユーザー名"
        value={ userName }
        onChange={(e) => setUserName(e.target.value)}
        required />
      <br />
      <input
        className={ styles.inputbox }
        type="password"
        placeholder="パスワード"
        value={ password }
        onChange={(e) => setPassword(e.target.value)}
        required />
      <br />
      <button type="submit" className={ styles.signUpBtn }>登録する</button>
    </form>

    { message && <p className={ styles.backendMessage }>{ message }</p> }
    
    <WarnContainer />
    </>
  )
}

export default SignUp;