import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useContext, useState } from "react";
import { NavContext } from "../../App";
import HeaderBar from "../../Components/HeaderBar/HeaderBar";
import "./LoginScreen.css";

const LoginScreen = () => {
  const { navigate, handleNavigate } = useContext(NavContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password).then(() => {
      navigate("/profile");
    });
  };

  return (
    <div className="contents">
      <HeaderBar title="Login" button="back" />
      <div id="login-screen">
        <h1>Welcome Back!</h1>
        <form>
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
            autoComplete="current-password"
            placeholder="Enter password"
          />
          <button onClick={handleSubmit} id="login">
            Login
          </button>
        </form>
        <p>Don't have an account?</p>
        <button onClick={handleNavigate} id="signup">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
