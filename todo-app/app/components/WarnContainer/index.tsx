import styles from "./styles.module.css";

const WarnContainer = () => {
  return (
    <div className={ styles.warnContainer }>
      <h3>利用上の注意</h3>
      <ul>
        <li>セキュリティが強くないので個人情報などの重要な情報を入力するのは避けてください</li>
        <li>アップデートによって告知なしに機能の追加、削除が行われる可能性があります</li>
      </ul>
    </div>
  )
}

export default WarnContainer;