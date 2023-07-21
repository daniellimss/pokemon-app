import { useContext } from "react";
import { NavContext, UserContext } from "../../App";
import "./HeaderBar.css";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const userObj = {
  uid: null,
  email: null,
  name: null,
  pic: null,
};

const HeaderBar = ({ title, userData = null, button = false }) => {
  const { user, setUser } = useContext(UserContext);
  const { navigate } = useContext(NavContext);

  const handleLogOut = async () => {
    await setUser(userObj);
    signOut(auth);
  };

  const handleClick = (e) => {
    if (e.target.id === "/") {
      handleLogOut();
      navigate("/");
    } else if (e.target.id === "back") {
      navigate(-1);
    }
  };

  let buttonDisplay;
  if (button === "logout") {
    buttonDisplay = (
      <button onClick={handleClick} id="/">
        Log Out
      </button>
    );
  } else if (button === "back") {
    buttonDisplay = (
      <button onClick={handleClick} id="back">
        Back
      </button>
    );
  }

  return (
    <div id="header">
      <div id="header-user">
        {title === user.name && <img src={user.pic} alt={user.name} />}
        {userData && <img src={userData.pic} alt={userData.name} />}
        <h1>{title}</h1>
      </div>
      {buttonDisplay}
    </div>
  );
};

export default HeaderBar;
