import { useContext, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, database } from "../../firebase";
import { NavContext, UserContext } from "../../App";
import "./SignUpScreen.css";
import { get, ref, set } from "firebase/database";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";

const userIcons = [
  "https://i.imgur.com/XZTIoPq.png",
  "https://i.imgur.com/TzcDN1E.png",
  "https://i.imgur.com/NkcfqP3.png",
  "https://i.imgur.com/L7oGJf7.png",
  "https://i.imgur.com/vmRbEuS.png",
];

const isValid = (input) => {
  const regex = /^[A-Za-z0-9]+$/;
  return regex.test(input) ? true : false;
};

const SignUpScreen = (props) => {
  const { setUser } = useContext(UserContext);
  const { navigate } = useContext(NavContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [name, setName] = useState("");
  const [pic, setPic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let passwordCheck = password === passwordAgain;
    let userCheck = false;

    if (!(email && password && name && pic)) {
      alert("Please fill in all fields!");
    } else if (!isValid(name)) {
      alert("Only letters and numbers are allowed in usernames.");
    } else {
      const usersRef = ref(database, "users/" + name.toLowerCase());
      get(usersRef)
        .then((response) => {
          if (!response.exists()) {
            userCheck = true;
            if (!passwordCheck) {
              alert("Passwords don't match!");
            }
          } else {
            alert("Username already exists.");
          }
        })
        .then(async () => {
          if (email && passwordCheck && userCheck) {
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
              displayName: name,
              photoURL: pic,
            });
            setUser((user) => {
              const userRef = ref(database, "users/" + name.toLowerCase());
              const userDetails = {
                name: name,
                pic: pic,
                email: email,
              };
              set(userRef, userDetails);
              return {
                ...user,
                name: name,
                pic: pic,
              };
            });

            navigate("/profile");
          }
        });
    }
  };

  let iconList = userIcons.map((url, index) => (
    <button
      key={url}
      onClick={(e) => {
        e.preventDefault();
        setPic(url);
      }}
      className={pic === url ? "selected" : ""}
    >
      <img src={url} alt={`user-icon-${index}`} />
    </button>
  ));

  return (
    <div className="contents">
      <HeaderBar title="Sign Up" button="back" />
      <div id="signup-screen">
        <h1>Create a New Account</h1>
        <form>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            placeholder="Enter Username"
          />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="Enter email"
          />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Enter password"
          />
          <input
            id="passwordAgain"
            type="password"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            autoComplete="new-password"
            placeholder="Re-enter password"
          />
          <p>Select your character</p>
          <div className="user-icons">{iconList}</div>
          <button onClick={handleSubmit} id="login">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;
