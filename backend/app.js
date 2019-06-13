const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const {MONGO_URL_DEV} = require('./config/setting');
const postsRoutes = require('./routes/posts')
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');
const app = express();

// IMPORTENT!!! THIS PROJECT NEED MONGODB CREDENTIALS
mongoose.connect(MONGO_URL_DEV)
.then(() => {
    console.log('connected to mongoDB');  
}).catch(err => {
    console.log(err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});
app.use('/api/posts',postsRoutes);
app.use('/api/user', userRoutes);
module.exports = app;