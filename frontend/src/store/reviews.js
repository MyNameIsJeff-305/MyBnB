import { csrfFetch } from './csrf';

//CONSTANTS
const SET_REVIEWS = 'reviews/setReviews';
const POST_REVIEW = 'reviews/postReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const DELETE_REVIEW = 'reviews/deleteReview';

//ACTION CREATORS
const setReviews = (spot) => ({
    type: SET_REVIEWS,
    payload: spot
});

const postReview = (review) => ({
    type: POST_REVIEW,
    payload: review
});

const updateReview = (updatedReview) => ({
    type: UPDATE_REVIEW,
    payload: updatedReview
});

const deleteReview = (deletedReview) => ({
    type: DELETE_REVIEW,
    payload: deletedReview
})

//THUNKS
export const getAllReviewsThunk = (spotId) => async(dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`)
    } catch (error) {

    }
}


//REDUCER
