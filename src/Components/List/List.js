import { useContext } from "react";
import "./List.css";
import { NavContext, UserContext } from "../../App";
import { ref, remove, set } from "firebase/database";
import { database } from "../../firebase";
import { useLocation } from "react-router-dom";

const List = ({ list, listOrder, setOrder = null, id }) => {
  const { navigate } = useContext(NavContext);
  const { user, DB_USERS_KEY } = useContext(UserContext);
  const location = useLocation();

  const handleClick = (e) => {
    const label = e.target.id;
    let index = Number(label.split("-")[0]);
    const reorderedList = [...listOrder];
    const targetItem = reorderedList.splice(index, 1);
    const DB_CURRENT_KEY =
      DB_USERS_KEY + "/" + user.name.toLowerCase() + "/" + id;

    if (label.includes("up")) {
      reorderedList.splice(index - 1, 0, ...targetItem);
    } else if (label.includes("down")) {
      reorderedList.splice(index + 1, 0, ...targetItem);
    } else if (label.includes("delete")) {
      const itemRef = ref(database, DB_CURRENT_KEY + "/" + targetItem);
      remove(itemRef);
    }
    const listOrderRef = ref(database, DB_CURRENT_KEY + "order");
    set(listOrderRef, reorderedList);
    setOrder(reorderedList);
  };

  let displayList;
  if (list && listOrder) {
    displayList = listOrder.map((pokemon, index) => (
      <div className="list-item" key={pokemon}>
        <div
          className="list-item-button"
          onClick={() => {
            setOrder
              ? navigate(location.pathname + "/" + id + "-" + pokemon)
              : navigate(
                  location.pathname + "?list=" + id + "&pokemon=" + pokemon
                );
          }}
        >
          <h2 className="rank">{index + 1}</h2>
          <h2>
            {list[pokemon].nickName
              ? list[pokemon].nickName
              : list[pokemon].name}
          </h2>
          <img src={list[pokemon].imgURL} alt={list[pokemon].name} />
        </div>
        {setOrder && (
          <div className="rank-panel">
            <button onClick={handleClick} id={index + "-delete"}>
              X
            </button>
            <button onClick={index > 0 ? handleClick : null} id={index + "-up"}>
              ⬆
            </button>

            <button
              onClick={index < listOrder.length ? handleClick : null}
              id={index + "-down"}
              index={index}
            >
              ⬇
            </button>
          </div>
        )}
      </div>
    ));
  } else {
    displayList = "";
  }
  return <div id="list">{displayList}</div>;
};

export default List;
