import React, { useEffect, useState } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { postReviewThunk } from '../../store/reviews';

function PostReviewModal({ spotId }) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const [errors, setErrors] = useState([]);
    const [showErrors, setShowErrors] = useState(false);

    const [stars, setStars] = useState([false, false, false, false, false]);


    const handleStarClick = (starIndex) => {
        const newStars = stars.map((star, index) => index <= starIndex ? true : false);
        setStars(newStars);
        setRating(starIndex + 1);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await dispatch(postReviewThunk({
            review: {
                review: review,
                stars: rating,
                spotId: parseInt(spotId)
            }
        }));

        if (errors.length > 0) {
            setShowErrors(true);
            return;
        } else {
            closeModal();
        }
    };

    return (
        <div className="post-review-container">
            <form className="post-review-form">
                <h1>How was your stay?</h1>
                {showErrors ? <p>{errors[0]}</p> : ''}
                <textarea
                    className="review-input"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave your review here..."
                />

                <div className='stars'>
                    {stars.map((star, index) => (
                        <div className='star' key={index} onClick={() => handleStarClick(index)}>
                            {star ? <FaStar /> : <FaRegStar />}
                        </div>
                    ))}
                </div>

                <button
                    className="post-review-button"
                    type="submit"
                    onClick={handleOnSubmit}
                >
                    Submit Your Review
                </button>
            </form>
        </div>
    );
}

export default PostReviewModal;
