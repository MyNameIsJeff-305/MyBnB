import { useDispatch, useSelector } from "react-redux";

function SpotCard({ spot }) {

    const mainImage = spot.

    return (
        <div className="spot-card">
            <div className="img">
                <img src={spot.previewImage} alt='main-image'></img>
            </div>
        </div>
    )

}

export default SpotCard;
