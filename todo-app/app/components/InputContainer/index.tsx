"use client";
import { useState, FormEvent, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import InputBox from "../../components/InputBox";

type Props = {
  type: string
  btnText: string
}

const InputContainer = ({ type, btnText }: Props) => {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8000/api/users/${ type }`, {
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

  const handleChange = (e: { target: { name: string; value: SetStateAction<string>; }; }) => {
    if (e.target.name === "userName") {
      setUserName(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  }

  return (
    <form onSubmit={ handleSubmit } className={ styles.inputContainer }>
      <InputBox
        type="text"
        name="userName"
        placeholder="ユーザー名"
        value={ userName }
        handleChange={ handleChange } />
      <br />
      <InputBox
        type="password"
        name="password"
        placeholder="パスワード"
        value={ password }
        handleChange={ handleChange } />
      <br />
      <button type="submit" className={ styles.submitBtn }>{ btnText }</button>
      { message && <p className={ styles.backendMessage }>{ message }</p> }
    </form>
  )
}

export default InputContainer;