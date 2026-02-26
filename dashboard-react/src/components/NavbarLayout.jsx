import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";



export default function NavbarLayout({ isAuthenticated, onLogout}) {
    return (
        <div className="layout">
            <div className="side">
            <Navbar 
                isAuthenticated={isAuthenticated} 
                onLogout={onLogout}
            />
        </div>


        <div className="main">
            <Outlet/>
        </div>
    </div>


    )
}