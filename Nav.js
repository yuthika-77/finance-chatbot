import React, { useState, useRef, useEffect } from 'react';
import './Nav.css';

 const header = ()=>{

    return(
        <header>
            <h1 id = "title ">Rupe-rt</h1>
        </header>
    )
}
const NavBar =  ()=>{

    return(
        <div className = "Nav">
            <ul className = "list">
                <li className = "list-items">Home</li>
                <li className = "list-items">Rupe-rt</li>
                <li className = "list-items">Quiz</li>
            </ul>
        </div>
    )
}
export default NavBar