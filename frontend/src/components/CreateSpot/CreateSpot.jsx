import { useDispatch, useSelector } from 'react-redux';
import './CreateSpot.css';
import { useState } from 'react';
import { postSpotThunk } from '../../store/spots';
import { useNavigate } from 'react-router-dom';

function CreateSpot() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const initialFormData = {
        country: '',
        streetAddress: '',
        ownerId: sessionUser.id,
        city: '',
        state: '',
        description: '',
        lat: 0,
        lng: 0,
        name: '',
        price: 0,
    };

    const initialspotImageFormData = {
        previewPicture: {},
        picture1: {},
        picture2: {},
        picture3: {},
        picture4: {}
    }

    const initialValidationErrors = {
        country: '',
        streetAddress: '',
        city: '',
        description: '',
        name: '',
        price: '',
        previewPicture: '',
        picture1: '',
        picture2: '',
        picture3: '',
        picture4: '',
    };

    const [formData, setFormData] = useState({ ...initialFormData });
    const navigate = useNavigate();
    const [validationErrors, setValidationErrors] = useState({ ...initialValidationErrors });
    const [showErrors, setShowErrors] = useState(false);
    const spots = useSelector((state) => state.spots.allSpots);


    const validateForm = () => {
        const errors = {};

        if (formData.country.length === 0) {
            errors.country = 'Country is required';
        }
        if (formData.streetAddress.length === 0) {
            errors.streetAddress = 'Street Address is required';
        }
        if (formData.city.length === 0) {
            errors.city = 'City is required';
        }
        if (formData.city.length === 0) {
            errors.state = 'State is required';
        }
        if (formData.description.length < 30) {
            errors.description = 'Description needs a minimum of 30 characters';
        }
        if (formData.name.length === 0) {
            errors.name = 'Name is required';
        }
        if (!formData.price) {
            errors.price = 'Price is required';
        }
        if (formData.price <= 0) {
            errors.price = 'Price must be greater than 0';
        }
        if (formData.previewPicture.length === 0) {
            errors.previewPicture = 'Preview image URL is required';
        }
        if (formData.picture1.length > 0 && ((!formData.picture1.endsWith('.png')) || (!formData.picture1.endsWith('.jpg')) || (!formData.picture1.endsWith('.jpeg'))))
            errors.picture1 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (formData.picture2.length > 0 && ((!formData.picture2.endsWith('.png')) || (!formData.picture2.endsWith('.jpg')) || (!formData.picture2.endsWith('.jpeg'))))
            errors.picture2 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (formData.picture3.length > 0 && ((!formData.picture3.endsWith('.png')) || (!formData.picture3.endsWith('.jpg')) || (!formData.picture3.endsWith('.jpeg'))))
            errors.picture3 = 'Image URL must end in .png, .jpg, or .jpeg'
        if (formData.picture4.length > 0 && ((!formData.picture4.endsWith('.png')) || (!formData.picture4.endsWith('.jpg')) || (!formData.picture4.endsWith('.jpeg'))))
            errors.picture4 = 'Image URL must end in .png, .jpg, or .jpeg'

        return errors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleOnSubmit = async() => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setShowErrors(true); // Show errors after clicking "Create Spot"
            return;
        }

        const res = await dispatch(postSpotThunk(formData));

        console.log(res);

        if(!res.ok) {
            const err = await res.json();
            const backendErrors = {};
            backendErrors.message = err.message;
            setValidationErrors(backendErrors);
        } else {
            navigate(`/spots/${res.id}`);
        }

        // Reset form data and validation errors
        setFormData({ ...initialFormData });
        setValidationErrors({ ...initialValidationErrors });
        setShowErrors(false); // Reset showErrors state

        alert('Spot created successfully!'); // Replace with actual success handling
    };

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
                        <div className='create-spot-section'>
                            <label id='create-spot-label'>
                                Country
                                {showErrors && validationErrors.country && <p className='error'>{validationErrors.country}</p>}
                            </label>
                            <input
                                className='create-spot-input'
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder='Country'
                            />
                        </div>
                        <div className='create-spot-section'>
                            <label id='create-spot-label'>
                                Street Address
                                {showErrors && validationErrors.streetAddress && <p className='error'>{validationErrors.streetAddress}</p>}
                            </label>
                            <input
                                className='create-spot-input'
                                type="text"
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleInputChange}
                                placeholder='Street Address'
                            />
                        </div>
                        <div className='city-state'>
                            <div className='city-container'>
                                <label id='create-spot-label'>
                                    City
                                    {showErrors && validationErrors.city && <p className='error'>{validationErrors.city}</p>}
                                </label>
                                <input
                                    className='create-spot-input'
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder='City'
                                />
                            </div>
                            <div className='comma'>, </div>
                            <div>
                                <label className='state' id='create-spot-label'>
                                    State
                                    {showErrors && validationErrors.state && <p className='error'>{validationErrors.state}</p>}
                                </label>
                                <input
                                    className='create-spot-input'
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
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
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder='Please write at least 30 characters'
                    />
                    {showErrors && validationErrors.description && <p className='error'>{validationErrors.description}</p>}
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
                        name="name"
                        value={formData.name}
                        placeholder='Name of your spot'
                        onChange={handleInputChange}
                    />
                    {showErrors && validationErrors.name && <p className='error'>{validationErrors.name}</p>}
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
                            value={formData.price}
                            placeholder='Price per night (USD)'
                            onChange={handleInputChange}
                        />
                    </div>
                    {showErrors && validationErrors.price && <p className='error'>{validationErrors.price}</p>}
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
                            value={formData.previewPicture}
                            placeholder='Preview Image URL'
                            onChange={handleInputChange}
                        />
                        {showErrors && validationErrors.previewPicture && <p className='error'>{validationErrors.previewPicture}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture1"
                            value={formData.picture1}
                            placeholder='Image URL'
                            onChange={handleInputChange}
                        />
                        {showErrors && validationErrors.picture1 && <p className='error'>{validationErrors.picture1}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture2"
                            value={formData.picture2}
                            placeholder='Image URL'
                            onChange={handleInputChange}
                        />
                        {showErrors && validationErrors.picture2 && <p className='error'>{validationErrors.picture2}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture3"
                            value={formData.picture3}
                            placeholder='Image URL'
                            onChange={handleInputChange}
                        />
                        {showErrors && validationErrors.picture3 && <p className='error'>{validationErrors.picture3}</p>}
                        <input
                            className='create-spot-input'
                            type="text"
                            name="picture4"
                            value={formData.picture4}
                            placeholder='Image URL'
                            onChange={handleInputChange}
                        />
                        {showErrors && validationErrors.picture4 && <p className='error'>{validationErrors.picture4}</p>}
                    </div>
                </div>
                <div className='divider-horizontal'></div>
                <div className='button-container'>
                    <button
                        className='create-spot-button'
                        type='submit'
                    >Create Spot</button>
                </div>
            </form>
        </div>
    );
}

export default CreateSpot;
