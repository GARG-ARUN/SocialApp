import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

export default function Conversation({conversation,currentUser}) {

  const [user,setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(()=>{
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("/users?userId="+friendId);
        setUser(res.data);
      } catch (error) {
        console.log(error)
      }
    }
    getUser();
  },[currentUser,conversation])

  return (
    <div className="conversation">
      <img
        src={user? user.profilepicture ? PF+ user.profilepicture : PF+="person/1.jpeg" : ""}
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
