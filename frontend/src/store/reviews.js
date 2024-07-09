import { csrfFetch } from './csrf';

//CONSTANTS
const SET_REVIEWS = 'reviews/setReviews';
const POST_REVIEW = 'reviews/postReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const DELETE_REVIEW = 'reviews/deleteReview';

//ACTION CREATORS
const setReviews = (reviews) => ({
    type: SET_REVIEWS,
    payload: reviews
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
export const getAllReviewsThunk = (spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
        const data = await res.json();
        dispatch(setReviews(data.Reviews));
    } catch (error) {
        return error
    }
}

export const postReviewThunk = (review) => async (dispatch) => {
    try {
        const options = {
            method: 'POST',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review.review)
        }

        // console.log(review);

        const res = await csrfFetch(`/api/spots/${review.review.spotId}/reviews`, options);

        // console.log(res);

        const result = await csrfFetch(`/api/spots/${review.review.spotId}/reviews`)
        // console.log("THIS IS RESULT", result);

        // const reviewForDispatching = result.json().Reviews

        if (res.ok) {
            const data = await result.json();
            dispatch(postReview(data));
        } else
            throw res;

    } catch (error) {
        return error;
    }
}

export const updatedReviewThunk = (reviewForm) => async (dispatch) => {
    try {
        const options = {
            method: 'PUT',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewForm)
        }

        const res = await csrfFetch(`/api/reviews/${reviewForm.id}`, options);

        if (res.ok) {
            const data = await res.json();
            dispatch(updateReview(data));
        } else
            throw res;

    } catch (error) {
        return error;
    }
}

export const deleteReviewThunk = (review) => async (dispatch) => {
    try {
        const options = {
            method: 'DELETE',
            header: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        }

        const res = await csrfFetch(`/api/reviews/${review.id}`, options)

        if (res.ok) {
            const data = await res.json();
            dispatch(deleteReview(data));
        } else
            throw res;

    } catch (error) {
        return error;
    }
}

//REDUCER
const initialState = {
    allReviews: [],
    byId: {}
}

function reviewsReducer(state = initialState, action) {
    let newState;

    switch (action.type) {
        case SET_REVIEWS: {
            newState = { ...state };
            newState.allReviews = action.payload;
            for (const review of newState.allReviews) {
                newState.byId[review.id] = review;
            }
            return newState;
        }

        case POST_REVIEW: {
            newState = { ...state };
            newState.allReviews = [action.payload, ...newState.allReviews];
            newState.byId = { ...newState.byId, [action.payload.id]: action.payload }
            return newState
        }

        case UPDATE_REVIEW: {
            newState = { ...state };
            const reviewId = action.payload.id;

            const newAllReviews = [];

            for (let i = 0; i < newState.allReviews.length; i++) {
                let currentReview = newState.allReviews[i];
                if (currentReview.id === reviewId) {
                    newAllReviews.push(action.payload);
                } else
                    newAllReviews.push(currentReview);
            }

            newState.allReviews = newAllReviews;
            newState.byId = { ...newState.byId, [reviewId]: action.payload };

            return newState;
        }

        case DELETE_REVIEW: {
            newState = { ...state };

            const filteredReviews = newState.allReviews.filter((review) => {
                return review.id !== action.payload.id
            });
            newState.allReviews = filteredReviews;

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

export default reviewsReducer;
