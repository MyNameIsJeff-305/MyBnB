import { useModal } from "../../context/Modal";
import '../LoginFormModal/LoginForm.css'

function OpenModalButton({ modalComponent, buttonText, onButtonClick, onModalClose }) {
    const { setModalContent, setOnModalClose } = useModal();

    const onClick = () => {
        if (onModalClose)
            setOnModalClose(onModalClose);
        setModalContent(modalComponent);

        if (typeof onButtonClick === 'function') onButtonClick();
    };

    return <button className='login-container' onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;