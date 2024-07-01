import { csrfFetch } from './csrf';

//CONSTANTS
const SET_SPOTS = 'spots/getAllSpots';
const POST_SPOT = 'spots/postSpot';
const UPDATE_SPOT = 'spots/updateSpot';
const DELETE_SPOT = 'spots/deleteSpot';


//ACTION CREATORS
const getAllSpots = (spots) => ({
    type: SET_SPOTS,
    payload: spots
});

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
    try {

        const res = await csrfFetch('/api/spots');
        const data = await res.json();
        dispatch(getAllSpots(data));

    } catch (error) {
        if(!res.ok) {
            let errors = await res.json();
            return errors;
        }
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
        case SET_SPOTS:
            console.log("THIS IS ACTION ",action);
            newState = { ...state };
            newState.allSpots = action.payload;

            for (const spot of action.payload) {
                newState.byId[spot.id] = spot;
            }
            return newState;

        case POST_SPOT:
            newState = { ...state };
            newState.allSpots = [action.payload, ...newState.allSpots];
            newState.byId = { ...newState.byId, [action.payload.id]: action.payload }
            return newState

        case UPDATE_SPOT:
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

        case DELETE_SPOT:
            newState = { ...state };

            const filteredSpots = newState.allSpots.filter((spot) => {
                return spot.id !== action.payload.id
            });
            newState.allSpots = filteredSpots;

            const newById = { ...newState.byId };
            delete newById[action.payload.id];
            newState.byId = newById;

            return newState;
        default:
            return state;
    }
}

export default spotsReducer;
