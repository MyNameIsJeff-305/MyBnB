import { FaRegStar, FaStar } from "react-icons/fa";
import './SpotDetails.css';

function Stars({ rating }) {
    const starArray = [];

    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starArray.unshift(1);
        } else {
            starArray.unshift(0);
        }
    }

    return (
        <div className="star-scale">
            {starArray.map((star, index) => (
                star === 1 ? <FaStar key={index} /> : <FaRegStar key={index} />
            ))}
        </div>
    )
}

export default Stars;
