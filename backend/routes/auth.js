const router = require("express").Router();
const User = require("../modules/User");
const bcrypt = require("bcrypt");

//Register
router.get("/d",async (req,res)=>{
    const allUsers = await User.find()
    console.log(allUsers);
})
router.post("/register",async (req,res) => {
    
    try{
        //generate salt password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        //create new user
        const user = await new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })
        //saved new user nad returned
        const newUser = await user.save();
        res.status(200).json(newUser);
    }catch(err) {
        res.status(500).json(err);
    }
})

//Login
router.post("/login",async (req,res) => {
    try{
        const user = await User.findOne({email:req.body.email});
        !user && res.status(400).json("user not found");
        
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("password is incorrect");

        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;