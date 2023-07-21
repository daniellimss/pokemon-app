import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import NavBar from "../../Components/NavBar/NavBar";
import "./PokeStatsScreen.css";
import PokeData from "./PokeData";
import { get, ref, set } from "firebase/database";
import { database } from "../../firebase";
import {
  ref as storeRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../firebase";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";

const PokeStatsScreen = ({ topten, wishlist }) => {
  const [editShow, setEditShow] = useState(false);
  const [editPokeName, setEditPokeName] = useState("");
  const [editLevel, setEditLevel] = useState("");
  const [fileInputFile, setFileInputFile] = useState(null);
  // const [fileInputValue, setFileInputValue] = useState("");

  const { link } = useParams();
  const { user } = useContext(UserContext);
  const [first, ...rest] = link.split("-");
  const listName = first;
  const pokeName = rest.join("-");
  const STORE_IMAGE_KEY = "images";

  const handleEditPokeName = () => {
    setEditShow(true);
  };

  const handleChange = (e) => {
    if (e.target.id === "name-change") {
      setEditPokeName(e.target.value);
    } else if (e.target.id === "level") {
      if (e.target.value <= 100) {
        setEditLevel(e.target.value);
      } else {
        alert("Please enter a level below 100");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listName === "topten") {
      //Making a reference to the database, to the location where we want to edit (database, URL), the URL is found from accessing our Firebase database console:
      let pokeRef = ref(
        database,
        `users/${user.name.toLowerCase()}/topten/${pokeName}`
      );
      //Retrieve the reference above in the following line:
      get(pokeRef).then((response) => {
        // response.val() gives the value at the URL
        //Make a copy of the response data which is currently an object
        let copiedData = { ...response.val() };
        //Reassign value based on updated state (name and level and image URL)
        //Update the object (copiedData's property of 'name') to the state
        //similar to : object-name.property = new value
        if (editPokeName) {
          copiedData["nickName"] = editPokeName;
        }
        if (editLevel) {
          copiedData["level"] = editLevel;
        }
        //set(pokeRef, var of the copied and edited object) [the actual updating of the firebase]
        if (fileInputFile) {
          const fileRef = storeRef(
            storage,
            `${STORE_IMAGE_KEY}/${fileInputFile.name}`
          );
          uploadBytesResumable(fileRef, fileInputFile).then(() => {
            getDownloadURL(fileRef).then((url) => {
              copiedData["customImg"] = url;
              // msg.url = url;
              set(pokeRef, copiedData);
            });
          });
        } else {
          set(pokeRef, copiedData);
        }
      });
      setEditPokeName("");
      setEditLevel("");
      setEditShow(false);
    }

    // DANIEL TAKE A LOOK AT THE BELOW COMMENTED OUT CODE

    // else if (listName === "wishlist") {
    //   let pokeRef = ref(
    //     database,
    //     `users/${user.name.toLowerCase()}/wishlist/${pokeName}`
    //   );
    //   get(pokeRef).then((response) => {
    //     let copiedData = { ...response.val() };
    //     if (copiedData.length === 10) {
    //       alert("cannot add to wishlist anymore");
    //     }
    //   });
    // }
  };

  const handleFileChange = (e) => {
    // console.log(e.target.files[0]);
    setFileInputFile(e.target.files[0]);
    // console.log(e.target.value);
    // setFileInputValue(e.target.value);
  };

  return (
    <div className="contents">
      <HeaderBar title="" button="back" />
      <div id="poke-stats">
        <PokeData topten={topten} wishlist={wishlist} />

        {listName === "topten" ? (
          <button className="edit-poke-name" onClick={handleEditPokeName}>
            Edit Pokemon
          </button>
        ) : null}

        {editShow && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              onChange={handleChange}
              id="name-change"
              placeholder="enter new name for pokemon"
              className="field-css"
              value={editPokeName}
            />
            <br />
            <input
              type="text"
              onChange={handleChange}
              id="level"
              placeholder="enter pokemon level"
              className="field-css"
              value={editLevel}
            />
            <br />
            <input
              type="file"
              onChange={handleFileChange}
              id="image"
              placeholder="upload new image"
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
      <NavBar />
    </div>
  );
};

export default PokeStatsScreen;
