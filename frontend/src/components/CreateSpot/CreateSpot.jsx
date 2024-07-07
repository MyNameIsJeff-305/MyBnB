// import { useDispatch, useSelector } from 'react-redux';
// import './CreateSpot.css';
// import { useState } from 'react';
// import { postSpotThunk } from '../../store/spots';
// import { useNavigate } from 'react-router-dom';
// import { postSpotImageThunk } from '../../store/spot-images';

// function CreateSpot() {
//     const dispatch = useDispatch();

//     const initialFormData = {
//         streetAddress: '',
//         city: '',
//         state: '',
//         country: '',
//         lat: 0,
//         lng: 0,
//         name: '',
//         description: '',
//         price: 0,
//     };

//     const initialSpotImageFormData = {
//         previewPicture: { url: '' },
//         picture1: { url: '' },
//         picture2: { url: '' },
//         picture3: { url: '' },
//         picture4: { url: '' }
//     }

//     const initialValidationErrors = {
//         country: '',
//         streetAddress: '',
//         city: '',
//         description: '',
//         name: '',
//         price: '',
//         previewPicture: '',
//         picture1: '',
//         picture2: '',
//         picture3: '',
//         picture4: '',
//     };

//     const [formData, setFormData] = useState({ ...initialFormData });
//     const [spotImagesData, setSpotImagesData] = useState({ ...initialSpotImageFormData });
//     const navigate = useNavigate();
//     const [validationErrors, setValidationErrors] = useState({ ...initialValidationErrors });
//     const [showErrors, setShowErrors] = useState(false);

//     const spots = useSelector((state) => state.spots.allSpots);
//     const spotImages = useSelector((state) => state.spotImages.allSpotImages);


//     const validateForm = () => {
//         const errors = {};

//         if (formData.country.length === 0) {
//             errors.country = 'Country is required';
//         }
//         if (formData.streetAddress.length === 0) {
//             errors.streetAddress = 'Street Address is required';
//         }
//         if (formData.city.length === 0) {
//             errors.city = 'City is required';
//         }
//         if (formData.city.length === 0) {
//             errors.state = 'State is required';
//         }
//         if (formData.description.length < 30) {
//             errors.description = 'Description needs a minimum of 30 characters';
//         }
//         if (formData.name.length === 0) {
//             errors.name = 'Name is required';
//         }
//         if (!formData.price) {
//             errors.price = 'Price is required';
//         }
//         if (formData.price <= 0) {
//             errors.price = 'Price must be greater than 0';
//         }
//         if (formData.previewPicture.length === 0) {
//             errors.previewPicture = 'Preview image URL is required';
//         }
//         if (spotImagesData.picture1.length > 0 && ((!spotImagesData.picture1.endsWith('.png')) || (!spotImagesData.picture1.endsWith('.jpg')) || (!spotImagesData.picture1.endsWith('.jpeg'))))
//             errors.picture1 = 'Image URL must end in .png, .jpg, or .jpeg'
//         if (spotImagesData.picture2.length > 0 && ((!spotImagesData.picture2.endsWith('.png')) || (!spotImagesData.picture2.endsWith('.jpg')) || (!spotImagesData.picture2.endsWith('.jpeg'))))
//             errors.picture2 = 'Image URL must end in .png, .jpg, or .jpeg'
//         if (spotImagesData.picture3.length > 0 && ((!spotImagesData.picture3.endsWith('.png')) || (!spotImagesData.picture3.endsWith('.jpg')) || (!spotImagesData.picture3.endsWith('.jpeg'))))
//             errors.picture3 = 'Image URL must end in .png, .jpg, or .jpeg'
//         if (spotImagesData.picture4.length > 0 && ((!spotImagesData.picture4.endsWith('.png')) || (!spotImagesData.picture4.endsWith('.jpg')) || (!spotImagesData.picture4.endsWith('.jpeg'))))
//             errors.picture4 = 'Image URL must end in .png, .jpg, or .jpeg'

//         return errors;
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         const { name, value } = e.target;
//         setSpotImagesData({ ...spotImagesData, [name]: value });
//     }

//     const handleOnSubmit = async () => {

//         const errors = validateForm();
//         if (Object.keys(errors).length > 0) {
//             setValidationErrors(errors);
//             setShowErrors(true); // Show errors after clicking "Create Spot"
//             return;
//         }

//         const createdSpot = await dispatch(postSpotThunk(formData));

//         console.log("THIS IS CREATED SPOT",createdSpot);

//         if (!createdSpot.ok) {
//             const err = await createdSpot.json();
//             const backendErrors = {};
//             backendErrors.message = err.message;
//             setValidationErrors(backendErrors);
//         } else {
//             const createdPreviewImage = await dispatch(postSpotImageThunk(previewPicture))

//             // Reset form data and validation errors
//             setFormData({ ...initialFormData });
//             setValidationErrors({ ...initialValidationErrors });
//             setShowErrors(false); // Reset showErrors state

//             navigate(`/spots/${createdSpot.id}`);
//             // alert('Spot created successfully!'); // Replace with actual success handling
//         }
//     };

//     return (
//         <div className='create-spot-container'>
//             <form className='create-spot-form' onSubmit={handleOnSubmit}>
//                 <div className='top'>
//                     <h1>Create a New Spot</h1>
//                     <h2>Where's your place located?</h2>
//                     <span>Guests will only get your exact address once they booked a reservation.</span>
//                 </div>
//                 <div className='bottom'>
//                     <div className='create-spot-left-panel'>
//                         <div className='create-spot-section'>
//                             <label id='create-spot-label'>
//                                 Country
//                                 {showErrors && validationErrors.country && <p className='error'>{validationErrors.country}</p>}
//                             </label>
//                             <input
//                                 className='create-spot-input'
//                                 type="text"
//                                 name="country"
//                                 value={formData.country}
//                                 onChange={handleInputChange}
//                                 placeholder='Country'
//                             />
//                         </div>
//                         <div className='create-spot-section'>
//                             <label id='create-spot-label'>
//                                 Street Address
//                                 {showErrors && validationErrors.streetAddress && <p className='error'>{validationErrors.streetAddress}</p>}
//                             </label>
//                             <input
//                                 className='create-spot-input'
//                                 type="text"
//                                 name="streetAddress"
//                                 value={formData.streetAddress}
//                                 onChange={handleInputChange}
//                                 placeholder='Street Address'
//                             />
//                         </div>
//                         <div className='city-state'>
//                             <div className='city-container'>
//                                 <label id='create-spot-label'>
//                                     City
//                                     {showErrors && validationErrors.city && <p className='error'>{validationErrors.city}</p>}
//                                 </label>
//                                 <input
//                                     className='create-spot-input'
//                                     type="text"
//                                     name="city"
//                                     value={formData.city}
//                                     onChange={handleInputChange}
//                                     placeholder='City'
//                                 />
//                             </div>
//                             <div className='comma'>, </div>
//                             <div>
//                                 <label className='state' id='create-spot-label'>
//                                     State
//                                     {showErrors && validationErrors.state && <p className='error'>{validationErrors.state}</p>}
//                                 </label>
//                                 <input
//                                     className='create-spot-input'
//                                     type="text"
//                                     name="state"
//                                     value={formData.state}
//                                     onChange={handleInputChange}
//                                     placeholder='STATE'
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className='divider-horizontal'></div>
//                 <div id='description-container' className='top'>
//                     <div>
//                         <h2>Describe your place to guests</h2>
//                         <span>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</span>
//                     </div>
//                     <textarea
//                         className='create-spot-textarea'
//                         type='textarea'
//                         name="description"
//                         value={formData.description}
//                         onChange={handleInputChange}
//                         placeholder='Please write at least 30 characters'
//                     />
//                     {showErrors && validationErrors.description && <p className='error'>{validationErrors.description}</p>}
//                 </div>
//                 <div className='divider-horizontal'></div>
//                 <div id='name-container' className='top'>
//                     <div>
//                         <h2>Create a title for your spot</h2>
//                         <span>Catch guests' attention with a spot title that highlights what makes your place special.</span>
//                     </div>
//                     <input
//                         className='create-spot-input'
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         placeholder='Name of your spot'
//                         onChange={handleInputChange}
//                     />
//                     {showErrors && validationErrors.name && <p className='error'>{validationErrors.name}</p>}
//                 </div>
//                 <div className='divider-horizontal'></div>
//                 <div id='price-container' className='top'>
//                     <div>
//                         <h2>Set a base price for your spot</h2>
//                         <span>Competitive pricing can help your listing stand out and rank higher in search results.</span>
//                     </div>
//                     <div className='price-area'>
//                         <label className='money-sign'>$</label>
//                         <input
//                             className='create-spot-input'
//                             type="number"
//                             name="price"
//                             value={formData.price}
//                             placeholder='Price per night (USD)'
//                             onChange={handleInputChange}
//                         />
//                     </div>
//                     {showErrors && validationErrors.price && <p className='error'>{validationErrors.price}</p>}
//                 </div>
//                 <div className='divider-horizontal'></div>
//                 <div id='spot-images-container' className='top'>
//                     <div>
//                         <h2>Liven up your spot with photos</h2>
//                         <span>Submit a link to at least one photo to publish your spot.</span>
//                     </div>
//                     <div className='spot-images-area'>
//                         <input
//                             className='create-spot-input'
//                             type="text"
//                             name="previewPicture"
//                             value={spotImagesData.previewPicture.url}
//                             placeholder='Preview Image URL'
//                             onChange={handleImageChange}
//                         />
//                         {showErrors && validationErrors.previewPicture && <p className='error'>{validationErrors.previewPicture}</p>}
//                         <input
//                             className='create-spot-input'
//                             type="text"
//                             name="picture1"
//                             value={spotImagesData.picture1.url}
//                             placeholder='Image URL'
//                             onChange={handleImageChange}
//                         />
//                         {showErrors && validationErrors.picture1 && <p className='error'>{validationErrors.picture1}</p>}
//                         <input
//                             className='create-spot-input'
//                             type="text"
//                             name="picture2"
//                             value={spotImagesData.picture2.url}
//                             placeholder='Image URL'
//                             onChange={handleImageChange}
//                         />
//                         {showErrors && validationErrors.picture2 && <p className='error'>{validationErrors.picture2}</p>}
//                         <input
//                             className='create-spot-input'
//                             type="text"
//                             name="picture3"
//                             value={spotImagesData.picture3.url}
//                             placeholder='Image URL'
//                             onChange={handleImageChange}
//                         />
//                         {showErrors && validationErrors.picture3 && <p className='error'>{validationErrors.picture3}</p>}
//                         <input
//                             className='create-spot-input'
//                             type="text"
//                             name="picture4"
//                             value={spotImagesData.picture4.url}
//                             placeholder='Image URL'
//                             onChange={handleImageChange}
//                         />
//                         {showErrors && validationErrors.picture4 && <p className='error'>{validationErrors.picture4}</p>}
//                     </div>
//                 </div>
//                 <div className='divider-horizontal'></div>
//                 <div className='button-container'>
//                     <button
//                         className='create-spot-button'
//                         type='submit'
//                         onClick={handleOnSubmit}
//                     >Create Spot</button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default CreateSpot;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postSpotThunk } from "../../store/spots";

import './CreateSpot.css';
import { postSpotImageThunk } from "../../store/spot-images";

function CreateSpot() {

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('USA');
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [errors, setErrors] = useState([]);
    const [previewPicture, setPreviewPicture] = useState('');
    const [picture1, setPicture1] = useState('');
    const [picture2, setPicture2] = useState('');
    const [picture3, setPicture3] = useState('');
    const [picture4, setPicture4] = useState('');
    const [showErrors, setShowErrors] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const spots = useSelector((state) => state.spots.allSpots);

    useEffect(() => {
        const errors = {};

        if (country.length === 0) {
            errors.country = 'Country is required';
        }
        if (address.length === 0) {
            errors.address = 'Street Address is required';
        }
        if (city.length === 0) {
            errors.city = 'City is required';
        }
        if (state.length === 0) {
            errors.state = 'State is required';
        }
        if (description.length < 30) {
            errors.description = 'Description needs a minimum of 30 characters';
        }
        if (name.length === 0) {
            errors.name = 'Name is required';
        }
        if (!price) {
            errors.price = 'Price is required';
        }
        if (price <= 0) {
            errors.price = 'Price must be greater than 0';
        }
        if (previewPicture.length === 0) {
            errors.previewPicture = 'Preview image URL is required';
        }

        if (previewPicture.length > 0 && ((!previewPicture.endsWith('.png')) && (!previewPicture.endsWith('.jpg')) && (!previewPicture.endsWith('.jpeg'))))
            errors.previewPicture = 'Image URL must end in .png, .jpg, or .jpeg'

        if (picture1.length > 0 && ((!picture1.endsWith('.png')) && (!picture1.endsWith('.jpg')) && (!picture1.endsWith('.jpeg'))))
            errors.picture1 = 'Image URL must end in .png, .jpg, or .jpeg'
        
        if (picture2.length > 0 && ((!picture2.endsWith('.png')) && (!picture2.endsWith('.jpg')) && (!picture2.endsWith('.jpeg'))))
            errors.picture2 = 'Image URL must end in .png, .jpg, or .jpeg'
        
        if (picture3.length > 0 && ((!picture3.endsWith('.png')) && (!picture3.endsWith('.jpg')) && (!picture3.endsWith('.jpeg'))))
            errors.picture3 = 'Image URL must end in .png, .jpg, or .jpeg'
        
        if (picture4.length > 0 && ((!picture4.endsWith('.png')) && (!picture4.endsWith('.jpg')) && (!picture4.endsWith('.jpeg'))))
            errors.picture4 = 'Image URL must end in .png, .jpg, or .jpeg'

        setErrors(errors);
    }, [country, address, city, state, description, name, price, previewPicture, picture1, picture2, picture3, picture4]);

    const handleOnSubmit = async (e) => {

        e.preventDefault();
        e.stopPropagation();

        const formData = {
            address: address,
            city: city,
            state: state,
            country: country,
            lat: 37.7645358,
            lng: 37.7645358,
            name: name,
            description: description,
            price: price,
        };

        const previewImagesData = [
            { url: previewPicture, preview: true },
            { url: picture1, preview: false },
            { url: picture2, preview: false },
            { url: picture3, preview: false },
            { url: picture4, preview: false }
        ]

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            setShowErrors(true); //Show errors after clicking Button
            return;
        }

        dispatch(postSpotThunk(formData));

        
        for (const image of previewImagesData) {
            if (image.url !== '') {
                dispatch(postSpotImageThunk(image, spots.length + 1))
            }
        }

        navigate(`/spots/${spots.length + 1}`);

    }

    return (
        <div className='create-spot-container'>
            <form className='create-spot-form'>
                <div className='top'>
                    <h1>Create a New Spot</h1>
                    <h2>Where`&apos;`s your place located?</h2>
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
                        <span>Catch guests`&apos;` attention with a spot title that highlights what makes your place special.</span>
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
                    >Create Spot</button>
                </div>
            </form>
        </div>
    );
}

export default CreateSpot;