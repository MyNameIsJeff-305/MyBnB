import { FaGlobe } from "react-icons/fa";
import { useSelector } from "react-redux";

import './NavBarLinks.css'
import { useNavigate } from "react-router-dom";

function NavBarLinks() {
    const sessionUser = useSelector(state => state.session.user);
    const navigate = useNavigate()

    const handleOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/spots/new')
    }

    return (
        <div className="nav-bar-links">
            <div className="host">
                    {
                        sessionUser !== null ?
                        <span className="create-spot" onClick={(e) => handleOnClick(e)}>Create a New Spot</span>
                        // <button className="create-spot-button" onClick={(e) => handleOnClick(e)}>Create a New Spot</button>
                             :
                            <></>
                    }
                <FaGlobe className="world" />
            </div>
        </div>
    )
}

export default NavBarLinks;
