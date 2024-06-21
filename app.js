/*
const app=require("express")
const http=require('http').Server(app);

const mongoose=require("mongoose");
mongoose.connect("")

const User=require('./models/userModel');

async function insert(){
    await User.create({
        name:'sandeep',
        email:"shishir17gamil.com"
    });
}
insert();


http.listen(3000,function(){
    console.log("server is running");
})
*/

const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const discussionRoutes = require('./routes/discussions');
const app = express();

mongoose.connect('mongodb+srv://shishir17recruit:6FKW1ZyeZdYTnLhU@socialappdb.u7bvocv.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/discussions', discussionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
