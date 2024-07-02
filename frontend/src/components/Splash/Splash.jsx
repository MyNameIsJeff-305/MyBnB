import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import SpotCard from "../SpotCard";

import './Splash.css';

function Splash() {
    const dispatch = useDispatch();
    const spots = useSelector((state) => state.spots.allSpots);

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]);


    // console.log(spots);

    return (
        <>
            <div className="spot-list">
                {spots.map(spot => (
                    <SpotCard key={spot.id} spot={spot} />
                ))}
            </div>
        </>
    )
}

export default Splash;
