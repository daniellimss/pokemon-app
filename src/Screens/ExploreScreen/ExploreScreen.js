//--------- Firebase ---------//

import { get, ref } from "firebase/database";
import { database } from "../../firebase";

//----------- React -----------//

import { useContext, useEffect, useState } from "react";

//-------- Components ---------//

import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "./ExploreScreen.css";

//--------- Variables  ---------//

import { NavContext, UserContext } from "../../App";
import { randomIndex } from "../../utils";

//------------------------------//

const ExploreScreen = ({ userList }) => {
  const { navigate } = useContext(NavContext);
  const { user, DB_USERS_KEY } = useContext(UserContext);
  const [list, setList] = useState([]);
  const [randNo, setRandNo] = useState(0);
  const [randomUser, setRandomUser] = useState(null);

  useEffect(() => {
    setList(userList.filter((name) => name !== user.name.toLowerCase()));
  }, [userList, user]);

  useEffect(() => {
    setRandNo(randomIndex(list.length));
  }, [list]);

  useEffect(() => {
    const userRef = ref(database, DB_USERS_KEY + "/" + list[randNo] + "/pic");
    get(userRef).then((data) => {
      if (data.exists()) {
        setRandomUser({
          name: list[randNo],
          pic: data.val(),
        });
      }
    });
    // eslint-disable-next-line
  }, [randNo, list]);

  const handleClick = (e) => {
    e.preventDefault();
    navigate("/search/" + list[randNo]);
  };
  return (
    <div className="contents">
      <HeaderBar title={"Explore"} />
      <div className="explore-map">
        {randomUser && (
          <button className="user-button" onClick={handleClick}>
            <img src={randomUser.pic} alt={randomUser.name} />
            <h3>{randomUser.name}</h3>
          </button>
        )}
        <img id="map" src="https://i.imgur.com/6h1JaNo.png" alt="map" />
      </div>
      <NavBar />
    </div>
  );
};

export default ExploreScreen;
