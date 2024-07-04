import { FaRegStar, FaStar } from "react-icons/fa";

import './SpotDetails.css';

function Stars({ rating }) {
    const starArray = new Array(5);

    if (rating < 5) {
        for (let i = 0; i < rating; i++) {
            starArray.push(1);
        }
        starArray.fill(0, rating, 5)
    } else {
        starArray.fill(1, 0, 5);
    }

    return (
        <div className="star-scale">
            {starArray.map((star) => (
                star === 1 ? <FaStar key={star}/> : <FaRegStar key={star}/>
            ))}
        </div>
    )
}

export default Stars;