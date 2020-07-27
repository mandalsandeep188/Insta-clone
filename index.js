//Setting up express and socket.io
const express = require("express");
const app = express();

const port = process.env.PORT || 5000;
//Setting up mongoose to use mongodb
const mongoose = require("mongoose");
const { mongourl } = require("./config/keys");

//Creating schema equivalent to table
//Import schema

//Connect to mongodb
mongoose.connect(mongourl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  console.log("conneted to mongo");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

require("./models/user");
require("./models/posts");

//Setting up static files like css,js,imges etc.
app.use(express.json());
// app.use(express.static('public'))
app.use(require("./routes/auth"));
app.use(require("./routes/posts"));
app.use(require("./routes/users"));

//Production setup
if(process.env.NODE_ENV=="production"){
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

//Listening on port
app.listen(port, () => {
  console.log("server is running on port " + port);
});
