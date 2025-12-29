import React from "react";
import { useState } from "react";
import {Link , useLocation} from "react-router-dom";
import {motion} from "framer-motion"

const NavBar : React.FC = () =>{
    const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Cart", path: "/cart" },
    { name: "Profile", path: "/profile" },
  ];
  const[hoveredPath,setHoveredPath] = useState<string | null>(null); 
  const { pathname } = useLocation();
    return(
        <div className="py-12">
         <nav className="mx-auto flex w-[500px] justify-around rounded-full py-1 shadow-md shadow-black text-white">
          {navLinks.map ((link) => {
            const isHovered = hoveredPath === link.path || (hoveredPath === null && pathname === link.path);
            return(
             <Link
             key = {link.path}
             to = {link.path}
             onMouseEnter={() =>setHoveredPath(link.path)}
             onMouseLeave={() => setHoveredPath(null)}
            className="relative px-4 py-1.5 text-xl font-medium font-montserrat text-white transition-colors hover:text-black">
                <span className="relative z-10">{link.name}</span>
                {
                    isHovered && (
                        <motion.div
                        layoutId="navbar-pill"
                        className="absolute inset-0 rounded-lg bg-white/20"
                        transition={{ type: "tween", ease :"easeInOut", duration:0.5 }}/>
                    )
                }
             </Link>
            )
          })}
         </nav>
        </div>
    )
}

export default NavBar;
