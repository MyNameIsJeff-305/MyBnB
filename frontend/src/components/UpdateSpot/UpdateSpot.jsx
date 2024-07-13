import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { loadSpotThunk, updateSpotThunk } from "../../store/spots";
import { postSpotImageThunk } from "../../store/spot-images";
import './UpdateSpot.css';

function UpdateSpot() {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const [previewPicture, setPreviewPicture] = useState('');
    const [picture1, setPicture1] = useState('');
    const [picture2, setPicture2] = useState('');
    const [picture3, setPicture3] = useState('');
    const [picture4, setPicture4] = useState('');
    const [showErrors, setShowErrors] = useState(false);
    const [loading, setLoading] = useState(true); // Start with loading true

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.spot);

    useEffect(() => {
        if (!spot || spot.id !== parseInt(spotId)) {
            dispatch(loadSpotThunk(parseInt(spotId)))
                .then(() => setLoading(false)); // Once loaded, setLoading to false
        } else {
            setAddress(spot.address || '');
            setCity(spot.city || '');
            setState(spot.state || '');
            setCountry(spot.country || '');
            setDescription(spot.description || '');
            setPrice(spot.price || 0);
            setName(spot.name || '');
            setLoading(false);
            setPreviewPicture(spot.SpotImages[0].url || '');
            setPicture1(spot.SpotImages[1].url || '');
            setPicture2(spot.SpotImages[2].url || '');
            setPicture3(spot.SpotImages[3].url || '');
            setPicture4(spot.SpotImages[4].url || '');
        }
    }, [dispatch, spot, spotId]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            spotId: parseInt(spotId),
            address,
            city,
            state,
            country,
            lat: 37.7645358,
            lng: 37.7645358,
            name,
            description,
            price,
        };

        // Validate form fields
        const newErrors = {};

        if (country.length === 0) {
            newErrors.country = 'Country is required';
        }

        if (address.length === 0) {
            newErrors.address = 'Street Address is required';
        }

        if (city.length === 0) {
            newErrors.city = 'City is required';
        }

        if (state.length === 0) {
            newErrors.state = 'State is required';
        }

        if (description.length < 30) {
            newErrors.description = 'Description needs a minimum of 30 characters';
        }

        if (name.length === 0) {
            newErrors.name = 'Name is required';
        }

        if (!price) {
            newErrors.price = 'Price is required';
        }

        if (price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (previewPicture.length === 0) {
            newErrors.previewPicture = 'Preview image URL is required';
        }

        if (previewPicture.length > 0 && ((!previewPicture.endsWith('.png')) && (!previewPicture.endsWith('.jpg')) && (!previewPicture.endsWith('.jpeg')) && (!previewPicture.endsWith('.webp'))))
            newErrors.previewPicture = 'Image URL must end in .png, .jpg, or .jpeg'

        if (picture1.length > 0 && ((!picture1.endsWith('.png')) && (!picture1.endsWith('.jpg')) && (!picture1.endsWith('.jpeg')) && (!picture1.endsWith('.webp'))))
            newErrors.picture1 = 'Image URL must end in .png, .jpg, or .jpeg'

        if (picture2.length > 0 && ((!picture2.endsWith('.png')) && (!picture2.endsWith('.jpg')) && (!picture2.endsWith('.jpeg')) && (!picture2.endsWith('.webp'))))
            newErrors.picture2 = 'Image URL must end in .png, .jpg, or .jpeg'

        if (picture3.length > 0 && ((!picture3.endsWith('.png')) && (!picture3.endsWith('.jpg')) && (!picture3.endsWith('.jpeg')) && (!picture3.endsWith('.webp'))))
            newErrors.picture3 = 'Image URL must end in .png, .jpg, or .jpeg'

        if (picture4.length > 0 && ((!picture4.endsWith('.png')) && (!picture4.endsWith('.jpg')) && (!picture4.endsWith('.jpeg')) && (!picture4.endsWith('.webp'))))
            newErrors.picture4 = 'Image URL must end in .png, .jpg, or .jpeg'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setShowErrors(true);
            return;
        }

        dispatch(updateSpotThunk(formData));

        // Handle image uploads if needed
        const previewImagesData = [
            { url: previewPicture, preview: true },
            { url: picture1, preview: false },
            { url: picture2, preview: false },
            { url: picture3, preview: false },
            { url: picture4, preview: false }
        ]

        for (const image of previewImagesData) {
            if (image.url !== '') {
                dispatch(postSpotImageThunk(image, spots.length + 1))
            }
        }
        // dispatch(postSpotImageThunk(...));

        setLoading(false);

        navigate(`/spots/${spotId}`);
    }

    if (loading) {
        console.log("THIS IS LOADING", loading);
        return (
            <div className="loading-spot">
                <img
                    src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                    alt="loading animation"
                    style={{ height: '40px', width: '40px' }}
                />
            </div>
        )
    }

    return (
        <div className='create-spot-container'>
            <form className='create-spot-form'>
                <div className='top'>
                    <h1>Create a New Spot</h1>
                    <h2>Where&apos;s your place located?</h2>
                    <span>Guests will only get your exact address once they booked a reservation.</span>
                </div>
                <div className='bottom'>
                    <div className='create-spot-left-panel'>
                        <div className='create-spot-section'>
                            <label id='create-spot-label'>
                                Country
                                {showErrors && errors.country && <p className='error'>{errors.country}</p>}
                            </label>
                            <input
                                className='create-spot-input'
                                type="text"
                                name="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder='Country'
                            />
                        </div>
                        <div className='create-spot-section'>
                            <label id='create-spot-label'>
                                Street Address
                                {showErrors && errors.address && <p className='error'>{errors.address}</p>}
                            </label>
                            <input
                                className='create-spot-input'
                                type="text"
                                name="streetAddress"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder='Street Address'
                            />
                        </div>
                        <div className='city-state'>
                            <div className='city-container'>
                                <label id='create-spot-label'>
                                    City
                                    {showErrors && errors.city && <p className='error'>{errors.city}</p>}
                                </label>
                                <input
                                    className='create-spot-input'
                                    type="text"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder='City'
                                />
                            </div>
                            <div className='comma'>, </div>
                            <div>
                                <label className='state' id='create-spot-label'>
                                    State
                                    {showErrors && errors.state && <p className='error'>{errors.state}</p>}
                                </label>
                                <input
                                    className='create-spot-input'
                                    type="text"
                                    name="state"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder='STATE'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='divider-horizontal'></div>
                <div id='description-container' className='top'>
                    <div>
                        <h2>Describe your place to guests</h2>
                        <span>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</span>
                    </div>
                    <textarea
                        className='create-spot-textarea'
                        type='textarea'
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Please write at least 30 characters'
                    />
                    {showErrors && errors.description && <p className='error'>{errors.description}</p>}
                </div>
                <div className='divider-horizontal'></div>
                <div id='name-container' className='top'>
                    <div>
                        <h2>Create a title for your spot</h2>
                        <span>Catch guests&apos; attention with a spot title that highlights what makes your place special.</span>
                    </div>
                    <input
                        className='create-spot-input'
                        type="text"
                        name="name"
                        value={name}
                        placeholder='Name of your spot'
                        onChange={(e) => setName(e.target.value)}
                    />
                    {showErrors && errors.name && <p className='error'>{errors.name}</p>}
                </div>
                <div className='divider-horizontal'></div>
                <div id='price-container' className='top'>
                    <div>
                        <h2>Set a base price for your spot</h2>
                        <span>Competitive pricing can help your listing stand out and rank higher in search results.</span>
                    </div>
                    <div className='price-area'>
                        <label className='money-sign'>$</label>
                        <input
                            className='create-spot-input'
                            type="number"
                            name="price"
                            value={price}
                            placeholder='Price per night (USD)'
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    {showErrors && errors.price && <p className='error'>{errors.price}</p>}
                </div>
                <div className='divider-horizontal'></div>
                <div id='spot-images-container' className='top'>
                    <div>
                        <h2>Liven up your spot with photos</h2>
                        <span>Submit a link to at least one photo to publish your spot.</span>
                    </div>
                    <div className='spot-images-area'>
                        <input
                            className='create-spot-input'
                            type="text"
                            name="previewPicture"
                            value={previewPicture}
                            placeholder='Preview Image URL'
                            onChange={(e) => setPreviewPicture(e.target.value)}
                        />
                        {showErrors && errors.previewPicture && <p className='error'>{errors.previewPicture}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture1"
                            value={picture1}
                            placeholder='Image URL'
                            onChange={(e) => setPicture1(e.target.value)}
                        />
                        {showErrors && errors.picture1 && <p className='error'>{errors.picture1}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture2"
                            value={picture2}
                            placeholder='Image URL'
                            onChange={(e) => setPicture2(e.target.value)}
                        />
                        {showErrors && errors.picture2 && <p className='error'>{errors.picture2}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture3"
                            value={picture3}
                            placeholder='Image URL'
                            onChange={(e) => setPicture3(e.target.value)}
                        />
                        {showErrors && errors.picture3 && <p className='error'>{errors.picture3}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture4"
                            value={picture4}
                            placeholder='Image URL'
                            onChange={(e) => setPicture4(e.target.value)}
                        />
                        {showErrors && errors.picture4 && <p className='error'>{errors.picture4}</p>}
                    </div>
                </div>
                <div className='divider-horizontal'></div>
                <div className='button-container'>
                    <button
                        className='create-spot-button'
                        type='submit'
                        onClick={(e) => handleOnSubmit(e)}
                    >Update Spot</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateSpot;
