import React from "react";
import {Link} from "react-router-dom";

const NavBar : React.FC = () =>{
    return(
        <div className="py-12">
         <nav className="mx-auto flex justify-around py-1   text-black  rounded-full h-12 w-200  shadow-md shadow-black">
            <Link to="/"  className="font-montserrat text-xl font-medium py-1.5 hover:text-blue-500">Home</Link>
            <Link to="/shop" className="font-montserrat text-xl font-medium py-1.5 hover:text-blue-500">Shop</Link>
            <Link to="/cart"  className=" font-montserrat text-xl font-medium py-1.5 hover:text-blue-500">Cart</Link>
            <Link to="/profile"  className="font-montserrat text-xl font-medium py-1.5 hover:text-blue-500">Profile</Link>
         </nav>
        </div>
    )
}

export default NavBar;
