import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SpotCard from "../SpotCard";
import { useEffect, useState } from "react";
import { getMySpotsThunk } from "../../store/spots";
import { FaPen } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";

import './ManageSpots.css';

function ManageSpots() {
    const dispatch = useDispatch();
    const mySpots = useSelector((state) => state.spots.mySpots);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getMySpotsThunk()).then(() => setLoading(false));
    }, [dispatch]);

    // console.log("THIS IS MY SPOTS", mySpots);

    const handleCreateNewSpot = () => {
        navigate('/spots/new');
    };

    const handleUpdateSpot = (spotId) => {
        navigate(`/spots/${spotId}/edit`);
    };

    const handleDeleteSpot = (spotId) => {
        // Implement the delete functionality
        console.log(`Deleting spot with id: ${spotId}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="manage-spots-container">
            <div className="manage-spots-top">
                <h1>Manage Your Spots</h1>
                <button onClick={handleCreateNewSpot}>Create a New Spot</button>
            </div>
            <div className="manage-spots-spots-container">
                {mySpots.length > 0 ? mySpots.map(spot => (
                    <div className="single-spot-card" key={spot.id}>
                        <SpotCard spot={spot} />
                        <div className="crud-buttons">
                            <button onClick={() => handleUpdateSpot(spot.id)}>
                                <FaPen />
                                Update
                            </button>
                            <button onClick={() => handleDeleteSpot(spot.id)}>
                                <FaTrashCan />
                                Delete
                            </button>
                        </div>
                    </div>
                )) : (
                    <div>No spots available</div>
                )}
            </div>
        </div>
    );
}

export default ManageSpots;
