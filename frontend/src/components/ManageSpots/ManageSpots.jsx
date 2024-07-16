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
    const user = useSelector((state) => state.session.user);
    const mySpots = useSelector((state) => state.spots.mySpots);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user)
            return navigate('/')
        dispatch(getMySpotsThunk()).then(() => setLoading(false));

    }, [dispatch, user]);

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

    const goToSpot = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();
        return navigate(`/spots/${spot.id}`);
    }

    if (!user || mySpots[0].ownerId !== user.id) {
        return navigate('/');
    }

    return (
        <div className="manage-spots-container">
            <div className="manage-spots-top">
                <h1>Manage Your Spots</h1>
                <button onClick={handleCreateNewSpot}>Create a New Spot</button>
            </div>
            <div className="manage-spots-spots-container">
                {mySpots.length > 0 ? mySpots.map(spot => (
                    <div className="single-spot-card" key={spot.id} onClick={(e) => goToSpot(e, spot)}>
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
                    <div></div>
                )}
            </div>
            {
                mySpots.length === 0 ?
                    <div className="no-spots">No spots available.</div> :
                    <div></div>
            }
        </div>
    );
}

export default ManageSpots;
