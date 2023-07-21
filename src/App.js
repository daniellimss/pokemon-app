//--------- Firebase ---------//

import { database, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  ref,
  onValue,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
} from "firebase/database";

//----------- React -----------//

import React, { useEffect, useState } from "react";

//-------- React Router --------//

import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

//---------- Screens  ----------//

import SplashScreen from "./Screens/SplashScreen/SplashScreen";
import LoginScreen from "./Screens/LoginScreen/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen/SignUpScreen";
import ProfileScreen from "./Screens/ProfileScreen/ProfileScreen";
import PokeStatsScreen from "./Screens/PokeStatsScreen/PokeStatsScreen";
import ExploreScreen from "./Screens/ExploreScreen/ExploreScreen";
import SearchPokeScreen from "./Screens/SearchPokeScreen/SearchPokeScreen";
import SearchUserScreen from "./Screens/SearchUserScreen/SearchUserScreen";
import ProfileUserScreen from "./Screens/ProfileUserScreen/ProfileUserScreen";

//--------- Variables  ---------//

const DB_USERS_KEY = "users";
// const DB_IMAGES_KEY = "images";
const UserContext = React.createContext(null);
const NavContext = React.createContext(null);
const userObj = {
  uid: null,
  email: null,
  name: null,
  pic: null,
};

//------------------------------//

const App = () => {
  const [user, setUser] = useState(userObj);
  const [userList, setUserList] = useState([]);
  const [topten, setTopten] = useState(null);
  const [toptenorder, setToptenorder] = useState([]);
  const [wishlist, setWishlist] = useState(null);
  const [wishlistorder, setWishlistorder] = useState(null);

  const navigate = useNavigate();
  const handleNavigate = (e) => {
    navigate(`/${e.target.id}`);
  };

  useEffect(() => {
    const usersRef = ref(database, DB_USERS_KEY);

    onChildAdded(usersRef, (data) => {
      setUserList((prevUsers) => [...prevUsers, data.key]);
    });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          pic: user.photoURL,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user.uid && user.name) {
      const CURRENT_USER_KEY = DB_USERS_KEY + "/" + user.name.toLowerCase();
      const toptenRef = ref(database, CURRENT_USER_KEY + "/topten");
      const toptenorderRef = ref(database, CURRENT_USER_KEY + "/toptenorder");
      const wishlistRef = ref(database, CURRENT_USER_KEY + "/wishlist");
      const wishlistorderRef = ref(
        database,
        CURRENT_USER_KEY + "/wishlistorder"
      );

      // for topten content updates
      onChildAdded(toptenRef, (data) => {
        const newItem = {
          [data.key]: data.val(),
        };
        setTopten((prevData) => ({ ...prevData, ...newItem }));
      });
      onChildRemoved(toptenRef, (data) => {
        setTopten((prevData) => {
          const updatedData = { ...prevData };
          delete updatedData[data.key];
          return updatedData;
        });
      });
      onChildChanged(toptenRef, (data) => {
        setTopten((prevData) => {
          const updatedData = { ...prevData };
          updatedData[data.key] = data.val();
          return updatedData;
        });
      });

      // for topten order updates
      onValue(toptenorderRef, (snapshot) => {
        const data = snapshot.val();
        setToptenorder(data);
      });

      // for wishlist content updates
      onChildAdded(wishlistRef, (data) => {
        const newItem = {
          [data.key]: data.val(),
        };
        setWishlist((prevData) => ({ ...prevData, ...newItem }));
      });
      onChildRemoved(wishlistRef, (data) => {
        setWishlist((prevData) => {
          const updatedData = { ...prevData };
          delete updatedData[data.key];
          return updatedData;
        });
      });
      onChildChanged(wishlistRef, (data) => {
        setWishlist((prevData) => {
          const updatedData = { ...prevData };
          updatedData[data.key] = data.val();
          return updatedData;
        });
      });

      // for wishlist order updates
      onValue(wishlistorderRef, (snapshot) => {
        const data = snapshot.val();
        setWishlistorder(data);
      });
    }
  }, [user]);

  return (
    <NavContext.Provider value={{ navigate, handleNavigate }}>
      <UserContext.Provider value={{ user, setUser, DB_USERS_KEY }}>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={user.uid ? <Navigate to="/profile" /> : <SplashScreen />}
            />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route
              path="/explore"
              element={
                user.uid ? (
                  <ExploreScreen userList={userList} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/profile">
              <Route
                index
                element={
                  user.uid ? (
                    <ProfileScreen
                      topten={topten}
                      toptenorder={toptenorder}
                      setToptenorder={setToptenorder}
                      wishlist={wishlist}
                      wishlistorder={wishlistorder}
                      setWishlistorder={setWishlistorder}
                    />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path=":link"
                element={
                  user.uid ? (
                    <PokeStatsScreen topten={topten} wishlist={wishlist} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Route>
            <Route
              path="/search-poke"
              element={
                user.uid ? (
                  <SearchPokeScreen DB_USERS_KEY={DB_USERS_KEY} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/search">
              <Route
                index
                element={
                  user.uid ? (
                    <SearchUserScreen userList={userList} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path=":link"
                element={user.uid ? <ProfileUserScreen /> : <Navigate to="/" />}
              />
            </Route>
          </Routes>
        </div>
      </UserContext.Provider>
    </NavContext.Provider>
  );
};

export default App;
export { UserContext, NavContext };
