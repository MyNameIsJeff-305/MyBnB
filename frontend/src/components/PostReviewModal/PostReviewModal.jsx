// import React, { useEffect, useState } from 'react';
// import { useModal } from '../../context/Modal';
// import { useDispatch, useSelector } from 'react-redux';
// import StarRating from './StarRating';
// import { FaRegStar, FaStar } from 'react-icons/fa';
// import { postReviewThunk } from '../../store/reviews';

// function PostReviewModal({spotId}) {
//     const [review, setReview] = useState('');
//     const [rating, setRating] = useState(0);
//     const { closeModal } = useModal();
//     const dispatch = useDispatch();

//     const [errors, setErrors] = useState({});

//     const [star1, setStar1] = useState(false);
//     const [star2, setStar2] = useState(false);
//     const [star3, setStar3] = useState(false);
//     const [star4, setStar4] = useState(false);
//     const [star5, setStar5] = useState(false);

//     const handleOnSubmit = (e) => {
//         e.preventDefault();
//         e.stopPropagation();
        
//         dispatch(postReviewThunk({review: {
//             review: review,
//             stars: rating
//         }, spotId: spotId}))

//         if(Object.keys(errors).length > 0) {
//             setErrors(errors);
//             return;
//         } else {
//             closeModal();
//         }
//     };

//     const handleOnCLick1 = () => {
//         setStar1(!star1);
//         setRating(1);
//     }

//     const handleOnCLick2 = () => {
//         if (!star2) {
//             setStar1(true);
//             setStar2(true);
//         } else {
//             setStar1(true);
//             setStar2(true);
//             setStar3(false);
//             setStar4(false);
//             setStar5(false);
//         }
//         setRating(2);
//     }

//     const handleOnCLick3 = () => {
//         if (!star3) {
//             setStar1(true);
//             setStar2(true);
//             setStar3(true);
//         } else {
//             setStar1(true);
//             setStar2(true);
//             setStar3(true);
//             setStar4(false);
//             setStar5(false);
//         }
//         setRating(3)
//     }

//     const handleOnCLick4 = () => {
//         if (!star4) {
//             setStar1(true);
//             setStar2(true);
//             setStar3(true);
//             setStar4(true);
//         } else {
//             setStar1(true);
//             setStar2(true);
//             setStar3(true);
//             setStar4(true);
//             setStar5(false);
//         }
//         setRating(4)
//     }

//     const handleOnCLick5 = () => {
//         if (!star5) {
//             setStar1(true);
//             setStar2(true);
//             setStar3(true);
//             setStar4(true);
//             setStar5(true);
//         } else {
//             setStar1(true);
//             setStar2(true);
//             setStar3(true);
//             setStar4(true);
//             setStar5(true);
//         }
//         setRating(5)
//     }

//     return (
//         <div className="post-review-container">
//             <form className="post-review-form">
//                 <h1>How was your stay?</h1>
//                 <textarea
//                     className="review-input"
//                     value={review}
//                     onChange={(e) => setReview(e.target.value)}
//                     placeholder="Leave your review here..."
//                 />

//                 <div className='stars'>
//                     <div className='star' onClick={handleOnCLick1}>
//                         {star1 ? <FaStar /> : <FaRegStar />}
//                     </div>
//                     <div className='star' onClick={handleOnCLick2}>
//                         {star1 && star2 ? <FaStar /> : <FaRegStar />}
//                     </div>
//                     <div className='star' onClick={handleOnCLick3}>
//                         {star1 && star2 && star3 ? <FaStar /> : <FaRegStar />}
//                     </div>
//                     <div className='star' onClick={handleOnCLick4}>
//                         {star1 && star2 && star3 && star4 ? <FaStar /> : <FaRegStar />}
//                     </div>
//                     <div className='star' onClick={handleOnCLick5}>
//                         {star1 && star2 && star3 && star4 && star5 ? <FaStar /> : <FaRegStar />}
//                     </div>
//                 </div>

//                 <button
//                     className="post-review-button"
//                     type="submit"
//                     onClick={handleOnSubmit}
//                 >
//                     Submit Your Review
//                 </button>
//             </form>
//         </div>
//     );
// }

// export default PostReviewModal;
import React, { useEffect, useState } from 'react';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import StarRating from './StarRating';
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
                stars: rating
            },
            spotId: spotId
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
                {showErrors ? <p>{errors[0]}</p>: ''}
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
