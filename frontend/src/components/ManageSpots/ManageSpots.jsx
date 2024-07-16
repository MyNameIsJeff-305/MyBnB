import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SpotCard from "../SpotCard";
import { useEffect, useState } from "react";
import { getMySpotsThunk } from "../../store/spots";
import { FaPen } from "react-icons/fa6";
import { FaTrashCan } from "react-icons/fa6";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";

import './ManageSpots.css';

function ManageSpots() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const mySpots = useSelector((state) => state.spots.mySpots);
    const [loading, setLoading] = useState(true);
    const [spotChecker, setSpotChecker] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user)
            return navigate('/')
        dispatch(getMySpotsThunk()).then(() => setLoading(false)).then(() => setSpotChecker(false));
    }, [dispatch, user, spotChecker, navigate]);

    const handleCreateNewSpot = () => {
        navigate('/spots/new');
    };

    const handleUpdateSpot = (e, spotId) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/spots/${spotId}/edit`);
    };

    const handleDeleteSpot = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const goToSpot = (e, spot) => {
        e.preventDefault();
        e.stopPropagation();
        return navigate(`/spots/${spot.id}`);
    }

    // if (!user || mySpots[0]?.ownerId !== user.id) {
    //     // return navigate('/');
    // }

    const onModalClose = () => {
        setSpotChecker(prev => !prev); // Toggle spotChecker to trigger useEffect
    };

    return (
        <div className="manage-spots-container">
            <div className="manage-spots-top">
                <h1>Manage Your Spots</h1>
                <button onClick={handleCreateNewSpot}>Create a New Spot</button>
            </div>
            <div className="manage-spots-spots-container">
                {
                    mySpots.length > 0 ?
                        mySpots.map(spot => (
                            <div className="single-spot-card" key={spot.id} onClick={(e) => goToSpot(e, spot)}>
                                <SpotCard spot={spot} />
                                <div className="crud-buttons">
                                    <button onClick={(e) => handleUpdateSpot(e, spot.id)}>
                                        <FaPen />
                                        Update
                                    </button>
                                    <button className="delete-button-spot" onClick={(e) => handleDeleteSpot(e, spot.id)}>
                                        <FaTrashCan />
                                        <OpenModalMenuItem
                                            itemText="Delete"
                                            modalComponent={<ConfirmDeleteModal spotId={spot.id} setSpotChecker={setSpotChecker} />}
                                            onModalClose={async () => {
                                                await onModalClose
                                            }}
                                        />
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
