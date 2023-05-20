import { Chat, Notifications, Person, Search } from "@material-ui/icons";
import React, { useContext } from "react";
import {Link} from "react-router-dom";
import '../css/navbar.css'
import { AuthContext } from "../Context/AuthContext";

export default function Navbar() {
  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarleft">
        <Link to='/' style={{textDecoration:"none"}}>
          <span className="logo">SocialApp</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="search-Icon" />
          <input placeholder="Search..." className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to='/messenger'>
            <span className="topbarLink">Homepage</span>
          </Link>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img src={user.profilepicture ? PF+user.profilepicture : PF+"person/noavatar.webp"} alt="" className="topbarImg" />
        </Link>
      </div>
    </div>
  );
}
