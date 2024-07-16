import { FaRegStar, FaStar } from 'react-icons/fa';
import './PostReviewModal.css';

const StarRating = ({ isClicked = false }) => {
    return (
        <div className='star-container'>
            {
                isClicked
                ? <FaStar />
                : <FaRegStar />
            }
        </div>
    )
};

export default StarRating;
