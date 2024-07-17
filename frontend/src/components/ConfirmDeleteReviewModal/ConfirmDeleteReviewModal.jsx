import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk } from "../../store/reviews";

import '../ConfirmDeleteModal/ConfirmDeleteModal.css';

function ConfirmDeleteModal({ reviewId, setDeleteReviewChecker }) {

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(deleteReviewThunk(reviewId))
            .then(() => { setDeleteReviewChecker(true) })
            .then(closeModal);

    }

    return (
        <div className="confirm-delete-container">
            <h1>Confirm Delete</h1>
            <span>Are you sure you want to delete this review?</span>
            <div className="delete-buttons-container">
                <button className="yes-button-modal" onClick={(e) => handleDelete(e)}>{'Yes (Delete Review)'}</button>
                <button className="no-button-modal" onClick={closeModal}>{'No (Keep Review)'}</button>
            </div>
        </div>
    )

}

export default ConfirmDeleteModal;