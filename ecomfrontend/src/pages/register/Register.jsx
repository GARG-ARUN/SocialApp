import axios from "axios";
import {useRef} from "react";
import "./register.css";
import {useNavigate} from "react-router";


export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useNavigate();
  console.log(history);
  const handelClick = async  (e) => {
    e.preventDefault();
    if(password.current.value!== passwordAgain.current.value){
      password.current.setCustomValidity("Password don't match");
    }else{
      const user = {
        username:username.current.value,
        email:email.current.value,
        password:password.current.value
      }
      try {
        const res = await axios.post("/auth/register",user);
        history("/login");
      } catch (error) {
        console.log(error); 
      }
    }
  } 
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialApp</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handelClick}>
            <input  placeholder="Username" ref={username} required className="loginInput" />
            <input type="email" placeholder="Email" ref={email} required className="loginInput" />
            <input type="password" placeholder="Password" ref={password} required className="loginInput" />
            <input type="password" placeholder="Password Again" ref={passwordAgain} required className="loginInput" />
            <button className="loginButton">Sign Up</button>
            <button className="loginRegisterButton">
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
