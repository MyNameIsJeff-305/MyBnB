import './Footer.css'

function Footer() {
    return (
        <div className="footer-container">
            <div className='about-container'>
                <div className='about-logo-container'>
                    <img src='/assets/logo.png'></img>
                    <h2>MyBnB</h2>
                </div>
                <div className='about-subcontainer'>
                    <h4>About</h4>
                    <span>MyBnB is a REPLICA of Airbnb. This project is designed to demonstrate the developer&apos;s skills. It is strictly an academic exercise and has no connection with Airbnb. MyBnB will NEVER ask you to share personal information, handle any payments, or reveal details related to the actual Airbnb. Furthermore, all &quot;listings&quot; on this site are entirely fictitious, using preloaded data. No bookings, listings, or accounts will be genuinely processed or enforced by MyBnB. If you want to make an actual booking, please visit: Airbnb.</span>
                </div>
            </div>
            <div className='author-container'>
                <h4>Author</h4>
                <a href="https://github.com/MyNameIsJeff-305">Michel Garcia</a>
            </div>
        </div>
    )
}

export default Footer;