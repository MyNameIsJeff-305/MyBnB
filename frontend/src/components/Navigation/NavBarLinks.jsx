import { FaGlobe } from "react-icons/fa";
import ProfileButton from '../ProfileButton';

function NavBarLinks() {
    return (
        <div className="nav-bar-links">
            <div className="host">
                <a className="a-tag" href="/become-a-host">
                    <span className="nav-bar-span">BnB your Home</span>
                </a>
                <FaGlobe className="world" />
            </div>
        </div>
    )
}

export default NavBarLinks;