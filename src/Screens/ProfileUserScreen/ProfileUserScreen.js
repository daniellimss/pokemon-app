//----------- React -----------//

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useParams, useSearchParams } from "react-router-dom";

//---------- Firebase ----------//

import { database } from "../../firebase";
import { get, ref } from "firebase/database";

//---------- Components ----------//

import List from "../../Components/List/List";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "../ProfileScreen/ProfileScreen.css";
import "../PokeStatsScreen/PokeStatsScreen.css";

//------------------------------//

const ProfileUserScreen = () => {
  const { link } = useParams();
  const [searchParams] = useSearchParams();
  const searchList = searchParams.get("list");
  const searchPokemon = searchParams.get("pokemon");
  const { DB_USERS_KEY } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [tab, setTab] = useState("top-ten");

  useEffect(() => {
    const DB_USER_SEARCH_KEY = DB_USERS_KEY + "/" + link;
    const userRef = ref(database, DB_USER_SEARCH_KEY);
    get(userRef).then((data) => {
      if (data.exists()) {
        setUserData(data.val());
      } else {
        setUserData("Error");
      }
    });
  }, [DB_USERS_KEY, link]);

  const handleToggle = (e) => {
    setTab(e.target.id);
  };

  let display;
  if (!searchList && userData) {
    display = (
      <>
        <HeaderBar title={userData.name} userData={userData} />
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
          </div>
          {tab === "top-ten" ? (
            <List
              list={userData.topten}
              listOrder={userData.toptenorder}
              id="topten"
            />
          ) : (
            <List
              list={userData.wishlist}
              listOrder={userData.wishlistorder}
              id="wishlist"
            />
          )}
        </div>
      </>
    );
  } else if (searchList) {
    let typeList = userData[searchList][searchPokemon].type.map((type) => (
      <div key={type} className={`poke-type ${type}`}>
        {type}
      </div>
    ));
    display = (
      <>
        <HeaderBar title="" button="back" />
        <div id="poke-stats">
          <h1>
            {searchList === "topten" && `${userData.name}'s`}{" "}
            {userData[searchList][searchPokemon].nickName
              ? userData[searchList][searchPokemon].nickName
              : userData[searchList][searchPokemon].name}
          </h1>
          <img
            className={userData[searchList][searchPokemon].type[0]}
            src={
              userData[searchList][searchPokemon].customImg
                ? userData[searchList][searchPokemon].customImg
                : userData[searchList][searchPokemon].imgURL
            }
            alt={userData[searchList][searchPokemon].name}
          />
          <div className="poke-types">{typeList}</div>
          {userData[searchList][searchPokemon].nickName && (
            <p>Species: {userData[searchList][searchPokemon].name}</p>
          )}
          {userData[searchList][searchPokemon].level && (
            <p>Level: {userData[searchList][searchPokemon].level}</p>
          )}
        </div>
      </>
    );
  } else {
    display = "";
  }

  return (
    <div className="contents">
      {display}
      <NavBar />
    </div>
  );
};

export default ProfileUserScreen;
