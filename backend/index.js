const express = require("express");
const app = express(); 
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const conversationRouter = require("./routes/conversations");
const messageRouter = require("./routes/messages");
const multer = require("multer");
const path = require("path");

dotenv.config();
mongoose.connect(process.env.SEC_URL,
    {useNewUrlParser:true,useUnifiedTopology : true},
    ()=>{
    console.log("mongo connected");
});

app.use("/images",express.static(path.join(__dirname,"public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"public/images")
    },
    filename:(req,file,cb) => {
        cb(null,req.body.name);
    }
});
const upload = multer({storage:storage});

app.post("/api/upload",upload.single("file"),(req,res)=> {
    try {
        return res.status(200).json("File uploaded successfully");
    } catch (error) {
        console.log(error);
    }
})

app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/posts",postRouter);
app.use("/api/conversations",conversationRouter);
app.use("/api/messages",messageRouter);



app.listen(8080,()=>{
    console.log("Server is Running");
})