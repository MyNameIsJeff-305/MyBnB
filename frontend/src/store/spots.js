import { csrfFetch } from './csrf';

//CONSTANTS
const SET_SPOTS = 'spots/getAllSpots';
const LOAD_SPOT = 'spots/loadSpot';
const POST_SPOT = 'spots/postSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const DELETE_SPOT = 'spots/deleteSpot';


//ACTION CREATORS
const getAllSpots = (spots) => ({
    type: SET_SPOTS,
    payload: spots
});

const loadSpot = (spotId) => ({
    type: LOAD_SPOT,
    payload: spotId
})

const postSpot = (spot) => ({
    type: POST_SPOT,
    payload: spot
});

const updateSpot = (updatedSpot) => ({
    type: UPDATE_SPOT,
    payload: updatedSpot
});

const deleteSpot = (deletedSpot) => ({
    type: DELETE_SPOT,
    payload: deletedSpot
})

//THUNKS
export const getAllSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');
    const data = await res.json();
    dispatch(getAllSpots(data));
}

export const loadSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    const data = await res.json();
    dispatch(loadSpot(data));
}

export const postSpotThunk = (spotForm) => async (dispatch) => {
    try {
        const options = {
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spotForm)
        }

        const res = await csrfFetch('/api/spots', options);

        if (res.ok) {
            const data = await res.json();
            dispatch(postSpot(data));
        } else
            throw res;

    } catch (error) {
        return error;
    }
}

export const updateSpotThunk = (spotForm) => async (dispatch) => {
    try {
        const options = {
            method: 'PUT',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spotForm)
        }

        const res = await csrfFetch(`/api/spots/${spotForm.spotId}`, options)

        if (res.ok) {
            const data = await res.json();
            dispatch(updateSpot(data));
        } else
            throw res;

    } catch (error) {
        return error;
    }
}

export const deleteSpotThunk = (spot) => async (dispatch) => {
    try {
        const options = {
            method: 'DELETE',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spot)
        }

        const res = await csrfFetch(`/api/spots/${spot.id}`, options);

        if (res.ok) {
            const data = await res.json();
            dispatch(deleteSpot(data));
        } else
            throw res;

    } catch (error) {
        return error;
    }
}

//REDUCER
const initialState = {
    allSpots: [],
    byId: {}
}

function spotsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {
        case SET_SPOTS: {
            newState = { ...state };
            newState.allSpots = action.payload.Spots;
            for (const spot of action.payload.Spots) {
                newState.byId[spot.id] = spot;
            }
            return newState;
        }
        case LOAD_SPOT: {
            return {
                ...state, spot: action.payload
            };
        }
        case POST_SPOT: {
            newState = { ...state };
            newState.allSpots = [action.payload, ...newState.allSpots];
            newState.byId = { ...newState.byId, [action.payload.id]: action.payload }
            return newState
        }

        case UPDATE_SPOT: {
            newState = { ...state };
            const spotId = action.payload.id;

            const newAllSpots = [];

            for (let i = 0; i < newState.allSpots.length; i++) {
                let currentSpot = newState.allSpots[i];
                if (currentSpot.id === spotId) {
                    newAllSpots.push(action.payload);
                } else {
                    newAllSpots.push(currentSpot);
                }
            }

            newState.allSpots = newAllSpots;
            newState.byId = { ...newState.byId, [spotId]: action.payload };

            return newState;
        }

        case DELETE_SPOT: {
            newState = { ...state };

            const filteredSpots = newState.allSpots.filter((spot) => {
                return spot.id !== action.payload.id
            });
            newState.allSpots = filteredSpots;

            const newById = { ...newState.byId };
            delete newById[action.payload.id];
            newState.byId = newById;

            return newState;
        }
        default: {
            return state;
        }
    }
}

export default spotsReducer;
