import { useDispatch } from 'react-redux';
import './CreateSpot.css';
import { useEffect, useState } from 'react';

function CreateSpot() {
    const dispatch = useDispatch();

    const [country, setCountry] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    // const [latitude, setLatitude] = useState('');
    // const [longitude, setLongitude] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [previewPicture, setPreviewPicture] = useState('');
    const [picture1, setPicture1] = useState('');
    const [picture2, setPicture2] = useState('');
    const [picture3, setPicture3] = useState('');
    const [picture4, setPicture4] = useState('');

    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        const validations = [];

    })

    const handleOnSubmit = () => {

    }

    return (
        <div className='create-spot-container'>
            <form className='create-spot-form' onSubmit={handleOnSubmit}>
                <div className='top'>
                    <h1>Create a New Spot</h1>
                    <h2>Where's your place located?</h2>
                    <span>Guests will only get your exact address once they booked a reservation.</span>
                </div>
                <div className='bottom'>
                    <div className='create-spot-left-panel'>
                        <label id='create-spot-label'>
                            Country
                            <input
                                className='create-spot-input'
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            />
                        </label>
                        {validationErrors.country && <p>{validationErrors.country}</p>}
                        <label id='create-spot-label'>
                            Street Address
                            <input
                                className='create-spot-input'
                                type="text"
                                value={streetAddress}
                                onChange={(e) => setStreetAddress(e.target.value)}
                                placeholder='Country'
                                required
                            />
                        </label>
                        {validationErrors.streetAddress && <p>{validationErrors.streetAddress}</p>}
                        <div className='city-state'>
                            <div>
                                <label id='create-spot-label'>
                                    City
                                    <input
                                        className='create-spot-input'
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder='Address'
                                        required
                                    />
                                </label>
                            </div>
                            <div className='comma'>, </div>
                            <div>
                                <label className='state' id='create-spot-label'>
                                    State
                                    <input
                                        className='create-spot-input'
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder='STATE'
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                        {validationErrors.city && <p>{validationErrors.city}</p>}
                        {validationErrors.state && <p>{validationErrors.state}</p>}
                        {/* <div className='latitude-longitude'>
                            <div>
                                <label id='create-spot-label'>
                                    Latitude
                                    <input
                                        className='create-spot-input'
                                        type="text"
                                        value={latitude}
                                        placeholder='Latitude'
                                        onChange={(e) => setLatitude(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className='comma'>, </div>
                            <div>
                                <label id='create-spot-label'>
                                    Longitude
                                    <input
                                        className='create-spot-input'
                                        type="text"
                                        value={longitude}
                                        placeholder='Longitude'
                                        onChange={(e) => setLongitude(e.target.value)}
                                    />
                                </label>
                            </div>
                        </div>
                        {validationErrors.latitude && <p>{validationErrors.latitude}</p>}
                        {validationErrors.longitude && <p>{validationErrors.longitude}</p>} */}
                    </div>
                </div>
                <div className='divider-horizontal'></div>
                <div id='description-container' className='top'>
                    <div>
                        <h2>Describe your place to guests</h2>
                        <span>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</span>
                    </div>
                    <textarea
                        className='create-spot-textarea'
                        type='textarea'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        minLength={30}
                        placeholder='Please write at least 30 characters'
                    />
                    {validationErrors.description && <p>{validationErrors.description}</p>}
                </div>
                <div className='divider-horizontal'></div>
                <div id='name-container' className='top'>
                    <div>
                        <h2>Create a title for your spot</h2>
                        <span>Catch guests' attention with a spot title that highlights what makes your place special.</span>
                    </div>
                    <input
                        className='create-spot-input'
                        type="text"
                        value={name}
                        placeholder='Name of your spot'
                        onChange={(e) => setName(e.target.value)}
                    />
                    {validationErrors.name && <p>{validationErrors.name}</p>}
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
                            value={price}
                            placeholder='Price per night (USD)'
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        {validationErrors.price && <p>{validationErrors.price}</p>}
                    </div>
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
                            value={previewPicture}
                            placeholder='Preview Image URL'
                            onChange={(e) => setPreviewPicture(e.target.value)}
                        />
                        {validationErrors.previewPicture && <p>{validationErrors.previewPicture}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            value={picture1}
                            placeholder='Image URL'
                            onChange={(e) => setPicture1(e.target.value)}
                        />
                        {validationErrors.picture1 && <p>{validationErrors.picture1}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            value={picture2}
                            placeholder='Image URL'
                            onChange={(e) => setPicture2(e.target.value)}
                        />
                        {validationErrors.picture2 && <p>{validationErrors.picture2}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            value={picture3}
                            placeholder='Image URL'
                            onChange={(e) => setPicture3(e.target.value)}
                        />
                        {validationErrors.picture3 && <p>{validationErrors.picture3}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            value={picture4}
                            placeholder='Image URL'
                            onChange={(e) => setPicture4(e.target.value)}
                        />
                        {validationErrors.picture4 && <p>{validationErrors.picture4}</p>}
                    </div>
                </div>
                <div className='divider-horizontal'></div>
                <div className='button-container'>
                    <button
                        className='create-spot-button'
                        onClick={() => handleButtonCLick()}
                    >Create Spot</button>
                </div>
            </form>
        </div>
    )

}

export default CreateSpot;