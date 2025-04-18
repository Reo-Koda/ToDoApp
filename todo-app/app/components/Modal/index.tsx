import styles from "./styles.module.css";

type Props = {
  toggleModal: () => void
  users?: User[] | null
}

type User = {
  user_name: string
  password: string
}

const Modal = ({ toggleModal, users }: Props) => {
  return (
    <div className={ styles.overlay } onClick={ toggleModal }>
      <div className={ styles.container } onClick={ (e) => e.stopPropagation() }>
        { users && <pre>{JSON.stringify(users, null, 1)}</pre> }
      </div>
    </div>
  )
}

export default Modal;