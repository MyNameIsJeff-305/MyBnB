import './Navigation.css';

function NavLogo() {
    return (
        <div className='nav-logo-container'>
            <img src='/public/logo.png' className='logo' alt='logo'></img>
            <span>MyBnB</span>
        </div>
    )
}

export default NavLogo;