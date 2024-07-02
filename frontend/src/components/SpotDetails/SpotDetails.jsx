import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllSpotsThunk } from "../../store/spots";

import './SpotDetails.css';

function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.byId[parseInt(spotId)]);


    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]);




    return (
        <div className="spot-details">
            <div className="header">
                <h1>{spot.name}</h1>
                <div className="location">
                    <span>{spot.city}</span>
                    <span>, </span>
                    <span>{spot.state}</span>
                </div>
            </div>

        </div>
    )
}

export default SpotDetails