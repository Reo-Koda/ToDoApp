import styles from "./page.module.css";
import Link from "next/link";
import InputContainer from "../../components/InputContainer";
import WarnContainer from "../../components/WarnContainer";

const SignIn = () => {
  return (
    <>
    <h2 className={ styles.title }>ログイン</h2>
    
    <InputContainer type="signin" btnText="ログイン" />

    <div className={ styles.signUpBox }>
      <Link href="/signup" className={ styles.signUp }>新規登録はこちらへ</Link>
    </div>

    <WarnContainer />
    </>
  )
}

export default SignIn;