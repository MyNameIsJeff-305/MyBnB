import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { loadSpotThunk } from "../../store/spots";
import { getAllReviewsThunk } from "../../store/reviews";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import { FaStar } from 'react-icons/fa';

import './SpotDetails.css';
import ReviewCard from "./ReviewCard";

function SpotDetails() {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector((state) => state.spots.spot);
    const reviews = useSelector((state) => state.reviews);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        dispatch(loadSpotThunk(spotId));
        dispatch(getAllReviewsThunk(spotId));
    }, [dispatch, spotId]);

    if (!spot) {
        return <div>loading...</div>;
    }

    const mainImage = spot.SpotImages?.filter((i) => i.preview === true) || [];
    const otherImages = spot.SpotImages?.filter((i) => i.preview === false) || [];

    let avgRating = "New!";

    if (spot.avgStarRating)
        avgRating = spot.avgStarRating.toString().slice(0, 3);

    const displayedImages = otherImages.slice(0, 4);

    const handleOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        window.alert("Feature Coming Soon...")
    }

    const closeMenu = () => setShowMenu(false);

    return (
        <div className="spot-details">
            <div className="header">
                <h1>{spot.name}</h1>
                <span>{spot.city}, {spot.state}</span>
            </div>
            <div className="images">
                <div className="left-image-panel">
                    {mainImage.length > 0 && <img key={mainImage[0].id} src={mainImage[0].url} alt="Main preview" />}
                </div>
                <div className="right-image-panel">
                    {displayedImages.map((i, index) => (
                        <div key={i.id} className="image-container">
                            <img className="image-tile" src={i.url} alt={`Image ${i.id}`} />
                            {index === 3 && otherImages.length > 4 && (
                                <button className="all-pictures-button">All Pictures</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="description-panel">
                <div className="description-panel-left">
                    <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
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
                        <button className="reserve-button" onClick={(e) => handleOnClick(e)}>Reserve</button>
                    </div>
                </div>
            </div>
            <div className='divider'></div>
            <div className="reviews2">
                <div className="avg-reviews2">
                    <FaStar />
                    <span>{avgRating}</span>
                </div>
                <div className="num-reviews2">
                    <span>{spot.numReviews} reviews</span>
                </div>
                <div className="post-review">
                    {
                        sessionUser !== null ?
                            <button className="post-review-button">Post your Review</button> :
                            <div className="log-in-to-review">
                                <OpenModalMenuItem
                                    itemText="Log In to Review"
                                    onItemClick={closeMenu}
                                    modalComponent={<LoginFormModal />}
                                />
                            </div>
                    }

                </div>
            </div>
            <div className="reviews-container">
                {reviews.allReviews.map((review) => (
                    <ReviewCard review={review} />
                ))}
            </div>
        </div>
    )
}

export default SpotDetails;
