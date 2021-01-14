import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

const NavBar = (props) => {
    const [isVisible, setVisible] = useState(false);
    return (
        <nav className="navbar">
            <h1>Video Editor</h1>
            <button onClick={() => setVisible(!isVisible)}>
                Library
                <FontAwesomeIcon icon={ faMusic } />
            </button>
        </nav>
    )
}

export default NavBar;