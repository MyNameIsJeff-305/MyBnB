import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadSpotThunk } from "../../store/spots";
import { FaStar } from 'react-icons/fa';

import './SpotDetails.css';

function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.spot);


    useEffect(() => {
        dispatch(loadSpotThunk(spotId));
    }, [dispatch]);

    if (!spot) {
        return <div>loading...</div>
    }

    const mainImage = spot.SpotImages.filter((i) => i.preview === true)
    const otherImages = spot.SpotImages.filter((i) => i.preview === false);

    let avgRating = "New!";

    // console.log("THIS IS SPOT", spot);

    if (spot.avgStarRating)
        avgRating = spot.avgStarRating.toString().slice(0, 3);

    return (
        <div className="spot-details">
            <div className="header">
                <h1>{spot.name}</h1>
                <span>{spot.city}, {spot.state}</span>
            </div>
            <div className="images">
                <div className="left-image-panel">
                    <img key={mainImage[0].id} src={mainImage[0].url}></img>
                </div>
                <div className="right-image-panel">
                    {
                        for(let i = 0; i < 4; i++){
                            <img src={spotImages[i].url} key={spotImages[i].id}></img>
                        }
                        if(spotImages.length > 4)
                            <button className="more-images">Show All Photos</button>
                    }
                </div>
            </div>
            <div className="description-panel">
                <div className="description-panel-left">
                    <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                    <span className="description">{spot.description}</span>
                </div>
                <div className="description-panel-right">
                    <div className="price-reviews">
                        <div className="price">
                            <span className="price-span">${spot.price} </span>
                            <span>night</span>
                        </div>
                        <div className="reviews">
                            <div className="avg-reviews">
                                <FaStar />
                                <span>{avgRating}</span>
                            </div>
                            <div className="num-reviews">
                                <span>{spot.numReviews} reviews</span>
                            </div>
                        </div>
                    </div>
                    <div className="reserve">
                        <button className="reserve-button">Reserve</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SpotDetails
