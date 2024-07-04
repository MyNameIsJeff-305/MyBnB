import NavLogo from '../Navigation/NavLogo';

import './PageNotFound.css';

function PageNotFound() {

    return (
        <div className='main-container'>
            <div className='left-panel'>
                <h1>Oops!</h1>
                <h2>We can't seem to find the page you're looking for.</h2>
                <span>Error code: 404</span>
                <a href='/'>Back to Home</a>
            </div>
            <div className='right-panel'>
                <img src='https://a0.muscache.com/airbnb/static/error_pages/404-Airbnb_final-d652ff855b1335dd3eedc3baa8dc8b69.gif'></img>
            </div>
        </div>
    )

}

export default PageNotFound;