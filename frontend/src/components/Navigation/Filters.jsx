import './Navigation.css';
import { FaSearch } from "react-icons/fa";

function Filters() {
    return (
        <div className='filters-container'>
            <div className='item'>
                <span>Anywhere</span>
                <div className='divider'></div>
            </div>
            <div className='item'>
                <span>Any Week</span>
                <div className='divider'></div>
            </div>
            <div className='guest-item'>
                <span>Add Guests</span>
            </div>
            <div className='search'>
                <FaSearch className='fa-search'/>
            </div>
        </div>
    )
}

export default Filters;