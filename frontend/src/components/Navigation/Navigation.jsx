import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from '../ProfileButton';
import * as sessionActions from '../../store/session';

import './Navigation.css'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const sessionLinks = sessionUser ? (
        <>
            <li>
                <ProfileButton user={sessionUser} />
            </li>
            <li>
                <button onClick={logout}>Log Out</button>
            </li>
        </>) : (
        <>
            <li>
                <NavLink to="/login">Log In</NavLink>
            </li>
            <li>
                <NavLink to="/signup">Sign Up</NavLink>
            </li>
        </>);

    return (
        <nav className='navigation'>
            <ul className='navigation-list'>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                {isLoaded && sessionLinks}
            </ul>
        </nav>
    );
}

export default Navigation;