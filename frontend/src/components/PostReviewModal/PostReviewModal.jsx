import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { postReviewThunk } from '../../store/reviews';
import { useModal } from '../../context/Modal';

import './PostReviewModal.css'

function PostReviewModal({ spotId, setReviewChecker }) {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    const [showErrors, setShowErrors] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const dispatch = useDispatch();
    const { closeModal } = useModal();

    useEffect(() => {
        if (review.length >= 10 && rating > 0) {
            setButtonDisabled(false);
        } else
            setButtonDisabled(true);
    }, [review, rating])

    const handleStarClick = (starIndex) => {
        setRating(starIndex + 1);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setErrors({});
        setShowErrors(false);

        return dispatch(postReviewThunk({
            review: {
                review: review,
                stars: rating,
                spotId: parseInt(spotId)
            }
        }))
            .then(async (res) => {
                // console.log("RES", res);
                if (res?.status === 500) {
                    setErrors({ message: "User can only review a spot once" });
                } else {
                    const data = await res?.json();
                    if (data?.errors) {
                        setErrors(data.errors);
                    }
                    setReviewChecker(true);
                    closeModal();
                }
                setShowErrors(true);
                if (errors.values.length === 0) {
                    setReviewChecker(true);
                    closeModal();
                }
            })
    };

    return (
        <div className="post-review-container">
            <form className="post-review-form" onSubmit={handleOnSubmit}>
                <h1>How was your stay?</h1>
                {showErrors ? <p>{errors.message}</p> : ''}
                <textarea
                    className="review-input"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave your review here..."
                />
                <div className='stars'>
                    {Array.from({ length: 5 }, (_, index) => (
                        <div className='post-reviewstar' key={index} onClick={() => handleStarClick(index)}>
                            {index < rating ? <FaStar /> : <FaRegStar />}
                        </div>
                    ))}
                </div>
                <button className="post-review-button" type="submit" disabled={buttonDisabled}>
                    Submit Your Review
                </button>
            </form>
        </div>
    );
}

export default PostReviewModal;
