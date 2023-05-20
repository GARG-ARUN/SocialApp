import "./post.css";
import { MoreVert, StayCurrentLandscape } from "@material-ui/icons";
import { useState,useEffect, useContext } from "react";
import axios from 'axios';
import {format} from 'timeago.js';
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function Post({ post }) {
  const [like,setLike] = useState(post.likes.length)
  const [isLiked,setIsLiked] = useState(false)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {user:currentUser} = useContext(AuthContext);
  const [user,setUser] = useState({});

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id))
  },[currentUser._id,post._likes]);

  useEffect(()=>{
    const fetchUsers = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    }
    fetchUsers();
  },[post.userId])
  const likeHandler = async ()=>{
    try {
      await axios.put("/posts/"+post._id+"/like",{userId:currentUser._id})
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like-1 : like+1)
    setIsLiked(!isLiked)
  }
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
            <img
              className="postProfileImg"
              src={user.profilepicture ? PF+user.profilepicture : PF+"person/noavatar.webp"}
              alt=""
              />
            </Link>
            <span className="postUsername">
              {user.username}
            </span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF+post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img className="likeIcon" src={`${PF}/like.png`} onClick={likeHandler} alt="" />
            <img className="likeIcon" src={`${PF}/heart.png`} onClick={likeHandler} alt="" />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
