import styles from "./page.module.css";
import InputContainer from "../../components/InputContainer";
import WarnContainer from "../../components/WarnContainer";

const SignUp = () => {
  return (
    <>
    <h2 className={ styles.title }>新規登録</h2>
    
    <InputContainer type="signup" btnText="新規登録" />
    
    <WarnContainer />
    </>
  )
}

export default SignUp;