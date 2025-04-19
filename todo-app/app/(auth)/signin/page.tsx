"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";

const SignIn = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userName, password: password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("authToken", data.token);
        console.log(data.token);

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
    <h2 className={ styles.title }>ログイン</h2>
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
      <button type="submit" className={ styles.loginBtn }>ログイン</button>
    </form>
    <div className={ styles.signUpBox }>
      <Link href="/signup" className={ styles.signUp }>新規登録はこちらへ</Link>
    </div>
    { message && <p className={ styles.backendMessage }>{ message }</p> }
    <div className={ styles.warnContainer }>
      <h3 className={ styles.warnCentense }>利用上の注意</h3>
      <ul>
        <li>セキュリティが強くないので個人情報などの重要な情報を入力するのは避けてください</li>
        <li>アップデートによって告知なしに機能の追加、削除が行われる可能性があります</li>
      </ul>
    </div>
    </>
  )
}

export default SignIn;