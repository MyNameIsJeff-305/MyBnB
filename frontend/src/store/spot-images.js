import { csrfFetch } from "./csrf";

//CONSTANTS
const POST_SPOT_IMAGE = 'spotImages/postSpotImage';

const DELETE_SPOT_IMAGE = 'spotImages/deleteSpotImage';

//ACTION CREATORS
const postSpotImage = (spotImage) => ({
    type: POST_SPOT_IMAGE,
    payload: spotImage
})

const deleteSpotImage = (spotImage) => ({
    type: DELETE_SPOT_IMAGE,
    payload: spotImage
})

//THUNKS
export const postSpotImageThunk = (spotImage, spotId) => async (dispatch) => {
    try {
        const options = {
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spotImage)
        }
        // console.log("THIS IS SPOT IMAGE", spotImage);
        const res = await csrfFetch(`/api/spots/${spotId}/images`, options);

        if (res.ok) {
            const data = await res.json();
            dispatch(postSpotImage(data));
        } else
            throw res;

    } catch (error) {
        // console.log(error.json());
        return error;
    }
}

export const deleteSpotImageThunk = (spotImage) => async (dispatch) => {
    try {
        const options = {
            method: 'DELETE',
            header: {'Content-Type': 'application/json'},
            body: JSON.stringify(spotImage)
        }

        const res = await csrfFetch(`/api/spot-images/${spotImage.id}`, options);

        if(res.ok) {
            const data = await res.json();
            dispatch(deleteSpotImage(data));
        } else
            throw res;

    } catch (error) {
        return error;
    }
}

//REDUCER
const initialState = {
    allSpotImages: [],
    byId: {}
}

function spotImagesReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case POST_SPOT_IMAGE: {
            newState = { ...state };
            newState.allSpotImages = [action.payload, ...newState.allSpotImages];
            newState.byId = { ...newState.byId, [action.payload.id]: action.payload };
            return newState;
        }
        case DELETE_SPOT_IMAGE: {
            newState = { ...state };

            const filteredSpotImages = newState.allSpotImages.filter((spotImage) => {
                return spotImage.id !== action.payload.id;
            });
            newState.allSpotImages = filteredSpotImages;

            const newById = { ...newState.byId };
            delete newById[action.payload.id];
            newState.byId = newById;

            return newState
        }
        default: {
            return state;
        }
    }
}

export default spotImagesReducer;