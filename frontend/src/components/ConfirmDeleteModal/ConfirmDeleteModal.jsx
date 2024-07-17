import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";
import { useModal } from '../../context/Modal';

import './ConfirmDeleteModal.css';

function ConfirmDeleteModal({ spotId, setSpotChecker }) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // console.log("THIS IS SPOTID", spotId);

        dispatch(deleteSpotThunk(spotId))
            .then(() => { setSpotChecker(true) })
            .then(closeModal);
    }

    return (
        <div className="confirm-delete-container">
            <h1>Confirm Delete</h1>
            <span>Are you sure you want to remove this spot from the listings?</span>
            <div className="delete-buttons-container">
                <button className="yes-button-modal" onClick={(e) => handleDelete(e)}>{'Yes (Delete Spot)'}</button>
                <button className="no-button-modal"  onClick={closeModal}>{'No (Keep Spot)'}</button>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal;