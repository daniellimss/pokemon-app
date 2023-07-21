import { useContext, useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../../firebase";
import { NavContext, UserContext } from "../../App";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import NavBar from "../../Components/NavBar/NavBar";
import "./SearchUserScreen.css";

const SearchUserScreen = ({ userList }) => {
  const [input, setInput] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [display, setDisplay] = useState(null);
  const { user, DB_USERS_KEY } = useContext(UserContext);
  const { navigate } = useContext(NavContext);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.name.toLowerCase() === input.toLowerCase()) {
      setDisplay(<h1>Why are you searching for yourself?</h1>);
    } else if (userList.includes(input.toLowerCase())) {
      const foundUserRef = ref(
        database,
        DB_USERS_KEY + "/" + input.toLowerCase()
      );
      get(foundUserRef).then((response) =>
        setFoundUser({ name: response.val().name, pic: response.val().pic })
      );
    } else {
      setFoundUser("none");
    }
    setInput("");
  };

  const handleClick = () => {
    navigate("/search/" + foundUser.name.toLowerCase());
  };

  useEffect(() => {
    if (foundUser === "none") {
      setDisplay(<h1>No User Found!</h1>);
    } else if (foundUser) {
      setDisplay(
        <div id="user-search-results">
          <button id="user-search-profile" onClick={handleClick}>
            <img src={foundUser.pic} alt={foundUser.name} />
            <h1>{foundUser.name}</h1>
          </button>
        </div>
      );
    }
    // eslint-disable-next-line
  }, [foundUser]);

  return (
    <div className="contents">
      <HeaderBar title={"User Search"} />
      <div id="user-search">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            placeholder="Enter Username"
          />
        </form>
        {display}
      </div>
      <NavBar />
    </div>
  );
};

export default SearchUserScreen;
