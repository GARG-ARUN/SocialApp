import "./profile.css";
import Topbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const username = useParams().username;
  const [user,setUser] = useState({});
  useEffect(()=>{
    const fetchUsers = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    }
    fetchUsers();
  },[username])
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverpicture ? PF+user.coverpicture :  "https://picsum.photos/600/300"}
                alt=""
              />
              <img
                className="profileUserImg"
                src={user.profilepicture ? PF + user.profilepicture : PF+"person/noavatar.webp"}
                alt=""
              />
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username}/>
            <Rightbar user={user}/>
          </div>
        </div>
      </div>
    </>
  );
}
