import styles from "./styles.module.css";

type Props = {
  toggleModal: () => void;
}

const Modal = ({ toggleModal }: Props) => {
  return (
    <div className={ styles.overlay } onClick={ toggleModal }>
      <div className={ styles.container } onClick={ (e) => e.stopPropagation() }></div>
    </div>
  )
}

export default Modal;