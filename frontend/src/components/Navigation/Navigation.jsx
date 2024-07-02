import { useSelector } from 'react-redux';
import ProfileButton from '../ProfileButton';
import './Navigation.css';
import NavLogo from './NavLogo';
import Filters from './Filters';
import NavBarLinks from './NavBarLinks';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className='navigation-list'>
            <NavLogo />
            <Filters />
            <div className='profile-container'>
                <NavBarLinks />
                <ProfileButton user={sessionUser} />
            </div>
        </div>
    );
}

export default Navigation;
