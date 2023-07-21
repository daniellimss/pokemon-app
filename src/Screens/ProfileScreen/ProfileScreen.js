//----------- React -----------//

import { useContext, useState } from "react";
import { NavContext, UserContext } from "../../App";

//---------- Components  ----------//

import List from "../../Components/List/List";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "./ProfileScreen.css";

//------------------------------//

const ProfileScreen = ({
  topten,
  toptenorder,
  setToptenorder,
  wishlist,
  wishlistorder,
  setWishlistorder,
}) => {
  const { handleNavigate } = useContext(NavContext);
  const { user } = useContext(UserContext);
  const [tab, setTab] = useState("top-ten");

  const handleToggle = (e) => {
    setTab(e.target.id);
  };

  return (
    <div className="contents">
      <HeaderBar title={user.name} button="logout" />
      <div id="profile-lists">
        <div id="profile-lists-tabs">
          <button
            onClick={handleToggle}
            id="top-ten"
            className={tab === "top-ten" ? "active-tab" : ""}
          >
            Top Ten
          </button>
          <button
            onClick={handleToggle}
            id="wishlist"
            className={tab === "wishlist" ? "active-tab" : ""}
          >
            Wishlist
          </button>
          <button onClick={handleNavigate} id="search-poke">
            +
          </button>
        </div>
        {tab === "top-ten" ? (
          <List
            list={topten}
            listOrder={toptenorder}
            setOrder={setToptenorder}
            id="topten"
          />
        ) : (
          <List
            list={wishlist}
            listOrder={wishlistorder}
            setOrder={setWishlistorder}
            id="wishlist"
          />
        )}
      </div>

      <NavBar />
    </div>
  );
};

export default ProfileScreen;
