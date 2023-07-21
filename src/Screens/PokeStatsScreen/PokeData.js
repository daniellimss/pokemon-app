import React from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
// import NavBar from "../../Components/NavBar/NavBar";
import "./PokeStatsScreen.css";
import { formatName } from "../../utils";

const PokeData = ({ topten, wishlist }) => {
  const { link } = useParams();
  const { user } = useContext(UserContext);
  const [first, ...rest] = link.split("-");
  const listName = first;
  const pokeName = rest.join("-");

  let pokeData;
  if (listName === "topten") {
    pokeData = topten[pokeName];
  } else if (listName === "wishlist") {
    pokeData = wishlist[pokeName];
  }

  let typeList = pokeData.type.map((type) => (
    <div key={type} className={`poke-type ${type}`}>
      {type}
    </div>
  ));

  return (
    <>
      <h1>
        {listName === "topten" && `${user.name}'s `}
        {pokeData.nickName ? pokeData.nickName : pokeData.name}
        {/*If pokemon has nickname, show nickname */}
        {/*else show pokemon's original name */}
      </h1>
      <img
        className={pokeData.type[0]}
        src={pokeData.customImg ? pokeData.customImg : pokeData.imgURL}
        alt={pokeData.name}
      />
      <div className="poke-types">{typeList}</div>
      {pokeData.nickName && <p>Species: {formatName(pokeName)}</p>}
      {pokeData.level && <p>Level: {pokeData.level}</p>}
    </>
  );
};
export default PokeData;
