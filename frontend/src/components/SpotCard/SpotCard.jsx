import { useState } from "react";
import { FaStar } from 'react-icons/fa';
import './SpotCard.css';

function SpotCard({ spot }) {
    const [showTooltip, setShowTooltip] = useState(false);


    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <div className="spot-card" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <div className="img">
                <img className='spot-image' src={spot.previewImage} alt='main-image'></img>
            </div>
            <div className="spot-data">
                <div className="left-panel">
                    <div className="location">
                        <span>{spot.city}</span>
                        <span>, </span>
                        <span>{spot.state}</span>
                    </div>
                    <div className="price">
                        <span id="price">$</span>
                        <span id="price">{spot.price}</span>
                        <span> night</span>
                    </div>
                </div>
                <div className="right-panel">
                    <FaStar className="star" />
                    <span>{spot.avgRating.toString().slice(0, 3)}</span>
                </div>
            </div>
            {showTooltip && (
                <div className="tooltip">
                    {spot.name}
                </div>
            )}
        </div>
    )
}

export default SpotCard;
