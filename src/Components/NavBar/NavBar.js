import { useContext } from "react";
import { NavContext } from "../../App";
import "./NavBar.css";

const NavBar = () => {
  const { handleNavigate } = useContext(NavContext);
  return (
    <div id="nav">
      <button onClick={handleNavigate} id="explore">
        Explore
      </button>
      <button onClick={handleNavigate} id="profile">
        Profile
      </button>
      <button onClick={handleNavigate} id="search">
        Search
      </button>
    </div>
  );
};

export default NavBar;
