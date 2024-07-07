import { useNavigate } from 'react-router-dom';
import './Navigation.css';

function NavLogo() {
    const navigate = useNavigate();

    const handleNavigate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/');
    }

    return (
        <div className='nav-logo-container' onClick={(e) => handleNavigate(e)}>
            <img src='/logo.png' className='logo' alt='logo'></img>
            <span>MyBnB</span>
        </div>
    )
}

export default NavLogo;
