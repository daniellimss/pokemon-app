import React, { useContext } from "react";
import { useState } from "react";
import "./SearchPokeScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { formatName } from "../../utils";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";
import { UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";

//comment
const SearchPokeScreen = ({ DB_USERS_KEY }) => {
  const [input, setInput] = useState("");
  const [pokeData, setPokeData] = useState(null);
  const [pokeName, setPokeName] = useState("");
  const [addResult, setAddResult] = useState(false);
  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const inputValidation = (userInput) => {
    const regex = /^[A-Za-z0-9.-\s]+$/;

    if (regex.test(input)) {
      let clearInput = input;
      clearInput = clearInput.replace(/\./g, "");
      clearInput = clearInput.replace(/\s/g, "-");
      return clearInput.toLowerCase();
    } else {
      return false;
    }
    // return result with
    //(1) remove period
    //(2) replace space with hyphen
    //(3) change to lowercase
    // else, do all the other checks
    // if (input == "") {
    //   alert("please enter a pokemon name");
    // } else if (!regex.test(input)) {
    //   alert("please remove any special characters in input");
    // } else if (input.includes(hyphenatedString)) {
    //   alert("your input contains hyphen")
    // } /* else if (input.match(/\d+/g) !== null) {
    //alert("your input contains numbers")
    // } else if (input.includes(/\./g, "-")) {
    //   return input.toLowerCase();
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = inputValidation(input);
    if (result) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${result}`)
        .then((response) => {
          let arrTypes = [];
          //check how many types?
          for (let i = 0; i < response.data.types.length; i++) {
            arrTypes.push(response.data.types[i].type.name);
          }
          //create array of types
          //push types into array and into line 67
          const retrievedData = {
            name: formatName(response.data.name),
            type: arrTypes,
            imgURL: response.data.sprites.front_default,
          };
          setPokeName(response.data.name); //storing the response data as a state
          setPokeData(retrievedData); // --ditto--
          setAddResult(false);
        })
        .catch((error) => {
          setPokeData(null);
          setAddResult("not-found");
        });
    } else {
      setPokeData(null);
      setAddResult("invalid-input");
    }
  };

  const handleClick = (e) => {
    const pokeRef = ref(
      database,
      DB_USERS_KEY +
        "/" +
        user.name.toLowerCase() +
        "/" +
        e.target.id +
        "/" +
        pokeName
    );
    const listOrderRef = ref(
      database,
      DB_USERS_KEY + "/" + user.name.toLowerCase() + "/" + e.target.id + "order"
    );
    get(pokeRef).then((data) => {
      if (data.exists()) {
        setAddResult("already-added");
      } else {
        get(listOrderRef).then((data) => {
          if (data.exists()) {
            if (data.val().length === 10) {
              setAddResult("limit-reached");
            } else if (data.val().length < 10) {
              set(pokeRef, pokeData);
              const newList = [...data.val(), pokeName];
              set(listOrderRef, newList);
              setAddResult("success");
            }
          } else {
            set(pokeRef, pokeData);
            set(listOrderRef, [pokeName]);
            setAddResult("success");
          }
        });
      }
    });
  };

  let result;
  if (addResult === "success") {
    result = "Pokémon Added!";
  } else if (addResult === "limit-reached") {
    result = "Cannot add more than 10 Pokémon!";
  } else if (addResult === "already-added") {
    result = "This Pokémon is already in your list.";
  } else if (addResult === "invalid-input") {
    result = "Invalid Input";
  } else if (addResult === "not-found") {
    result = "Pokémon not found!";
  }

  return (
    <div className="contents">
      <HeaderBar title="Add Pokemon" button="back" />
      <div className="pokeSearch">
        <div>
          <div className="flex-container">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="enter pokemon name"
                className="pokeSearchBox"
                onChange={handleChange}
                value={input}
              ></input>

              <button type="submit" className="pokeSearchIcon">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>
          </div>

          <br />

          <div>
            {pokeData ? (
              <div className="flex-container">
                <div className="flex-item results">{pokeData.name}</div>
                <img
                  src={pokeData.imgURL}
                  className="flex-item pokeImg"
                  alt={pokeData.name}
                />
                <p className="flex-item">{pokeData.arrTypes}</p>
                <div>
                  <button
                    className="flex-item plus"
                    onClick={handleClick}
                    id="topten"
                  >
                    Add to Top Ten
                  </button>
                  <button
                    className="flex-item star"
                    onClick={handleClick}
                    id="wishlist"
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            ) : null}
            {addResult && (
              <p className="results" id={addResult === "success" ? "" : "fail"}>
                {result}
              </p>
            )}
          </div>

          <br />
        </div>
        {/*  */}
      </div>
      <NavBar />
    </div>
  );
};

export default SearchPokeScreen;
