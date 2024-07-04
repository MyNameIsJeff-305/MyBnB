import { FaGlobe } from "react-icons/fa";
import { useSelector } from "react-redux";

import './Navigation.css'

function NavBarLinks() {
    const sessionUser = useSelector(state => state.session.user);

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
