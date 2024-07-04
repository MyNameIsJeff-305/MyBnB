import Stars from './Stars';
import './SpotDetails.css'

function ReviewCard({ review }) {

    const months = { 1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December' }
    const month = new Date(review.createdAt);


    return (
        <div className='review-card'>
            <div>
                <h4>{review.User.firstName}</h4>
            </div>
            <div className='review-date-stars'>
                <Stars rating={review.stars} />
                <div> ∙ </div>
                <h5>{months[month.getMonth()]} {month.getFullYear()}</h5>
            </div>
            <span>{review.review}</span>
        </div>
    )
}

export default ReviewCard;
