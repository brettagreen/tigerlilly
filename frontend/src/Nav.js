import { NavLink } from "react-router-dom";
//import './css/Nav.css';

function Nav({ isLoggedIn }) {

    return (
        <nav>
            <NavLink id="navLeft" className="navBarLink" exact="true" to="/">Home</NavLink>&nbsp;&nbsp;
            <span id="navRight">
                {isLoggedIn() ?
                    <>
                        <NavLink className="navBarLink" exact="true" to="/admin">Admin</NavLink>&nbsp;&nbsp;
                        <NavLink className="navBarLink" exact="true" to="/logout">Log out</NavLink>&nbsp;&nbsp;
                    </>
                    :
                    <>   
                        <NavLink className="navBarLink" exact="true" to="/">Current Issue</NavLink>&nbsp;&nbsp;
                        <NavLink className="navBarLink" exact="true" to="DROP DOWN">Past Issues</NavLink>&nbsp;&nbsp;
                        <NavLink className="navBarLink" exact="true" to="DROP DOWN">Our Journalists</NavLink>&nbsp;&nbsp;
                        <NavLink className="navBarLink" exact="true" to="/signup">Create an account</NavLink>&nbsp;&nbsp;
                        <NavLink className="navBarLink" exact="true" to="/login">Log in</NavLink>&nbsp;&nbsp;
                    </>
                }
            </span>
        </nav>
      );
}

export default Nav;