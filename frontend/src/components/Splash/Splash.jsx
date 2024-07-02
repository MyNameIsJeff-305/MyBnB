import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import SpotCard from "../SpotCard";

import './Splash.css';
import { useNavigate } from "react-router-dom";

function Splash() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.allSpots);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]);

    const goToSpot = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/spots/${spot.id}`);
    }

    return (
        <>
            <div className="spot-list">
                {spots.map(spot => (
                    <div className='spots' key={spot.id} onClick={(e) => goToSpot(e, spot)}>
                        <SpotCard key={spot.id} spot={spot} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default Splash;
