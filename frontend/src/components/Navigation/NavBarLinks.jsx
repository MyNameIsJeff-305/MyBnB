import { FaGlobe } from "react-icons/fa";
import ProfileButton from '../ProfileButton';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import OpenModalMenuItem from "./OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal/SignupFormModal"

import './Navigation.css'

function NavBarLinks() {
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false)

    const closeMenu = () => setShowMenu(false);

    return (
        <div className="nav-bar-links">
            <div className="host">
                    {
                        sessionUser !== null ?
                            <span className="create-spot">Create a New Spot</span> :
                            <></>
                    }
                <FaGlobe className="world" />
            </div>
        </div>
    )
}

export default NavBarLinks;
