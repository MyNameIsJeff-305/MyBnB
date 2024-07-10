import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { postReviewThunk } from '../../store/reviews';
import { useModal } from '../../context/Modal';

function PostReviewModal({ spotId, onModalClose, setReviewChecker }) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState([]);
    const [showErrors, setShowErrors] = useState(false);
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleStarClick = (starIndex) => {
        setRating(starIndex + 1);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setErrors([]);
        setShowErrors(false);

        try {
            await dispatch(postReviewThunk({
                review: {
                    review: review,
                    stars: rating,
                    spotId: parseInt(spotId)
                }
            }));

            setReviewChecker(true);

            onModalClose();
            closeModal();
        } catch (error) {
            setErrors([error.message]);
            setShowErrors(true);
        }
    };

    return (
        <div className="post-review-container">
            <form className="post-review-form" onSubmit={handleOnSubmit}>
                <h1>How was your stay?</h1>
                {showErrors && errors.length > 0 && <p>{errors[0]}</p>}
                <textarea
                    className="review-input"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave your review here..."
                />
                <div className='stars'>
                    {Array.from({ length: 5 }, (_, index) => (
                        <div className='star' key={index} onClick={() => handleStarClick(index)}>
                            {index < rating ? <FaStar /> : <FaRegStar />}
                        </div>
                    ))}
                </div>
                <button className="post-review-button" type="submit">
                    Submit Your Review
                </button>
            </form>
        </div>
    );
}

export default PostReviewModal;
