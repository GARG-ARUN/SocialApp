import "./messenger.css";
import Navbar from "../../components/Navbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import {io} from "socket.io-client";

export default function Messenger() {
  const [conversation,setConverstion] = useState([]);
  const [currentChat,setcurrentChat] = useState(null);
  const [messages,setMessages] = useState([]);
  const [newmessage,setNewMessage] = useState("");
  const [arrivalmessage,setArrivalMessage] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState(null);
  const socket = useRef();
  const {user} = useContext(AuthContext);
  const scrollRef = useRef();


  useEffect(()=>{
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage",data => {
      setArrivalMessage({
        sender : data.senderId,
        text : data.text,
        createdAt : Date.now()
      })
    })
  },[])

  useEffect(() => {
    arrivalmessage && 
    currentChat?.members.includes(arrivalmessage.sender) && 
    setMessages((prev) => [...prev,arrivalmessage])
  },[arrivalmessage,currentChat])

  useEffect(() => {
    socket.current.emit("addUser",user._id);
    socket.current.on("getUsers",users => {
      console.log(users);
      setOnlineUsers(user.following.filter(f=>users.some(u=>u.userId === f)));
    })
  },[user])
  

  useEffect(() => {
    const getConversation = async () =>{
      try{
        const res = await axios.get("/conversations/"+user?._id);
        setConverstion(res.data);
      }catch(err){
        console.log(err);
      }
    }
    getConversation();
  },[user._id])

  useEffect(() => {
    const getMessages = async () => {
      try{
        const res = await axios.get("/messages/"+currentChat._id);
        setMessages(res.data);
      }catch(err){
        console.log(err);
      }
    }
    getMessages();
  },[currentChat]);


  const handelSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender : user._id,
      text : newmessage,
      conversationId : currentChat._id
    };

    const receiverId = currentChat.members.find(member => member!==user._id);

    socket.current.emit("sendMessage",{
      senderId : user._id,
      receiverId : receiverId,
      text : newmessage,
    })

    try {
      const res = await axios.post("/messages",message);
      setMessages([...messages,res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error)
      
    }
  }

  

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : "smooth"})
  },[messages])

  console.log(onlineUsers)

  return (
    <>
      <Navbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuwrapper">
              <input placeholder="Search for friends" className="chatMenuInput" />
              {conversation.map((c)=> (
                <div onClick={() => setcurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user}/>
                </div>
              ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxwrapper">
            {
              currentChat ?
              (<>
              <div className="chatBoxTop">
                {messages.map((m) => (
                  <div ref={scrollRef}>
                    <Message message={m} own={m.sender === user._id}/>
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                  <textarea 
                  className="chatMessageInput" 
                  placeholder="write ....."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newmessage}
                  >
                  </textarea>
                  <button className="chatSubmitButton"
                  onClick={handelSubmit}
                  >
                    Send
                  </button>
              </div>
              </>)
             : (<span className="noConversationText">Open a conversation to start a chat.</span>)}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlinewrapper">
              <ChatOnline 
                onlineUsers={onlineUsers} 
                currentId={user._id}
                setcurrentChat={setcurrentChat}
              />
          </div>
        </div>
      </div>
    </>
  );
}
