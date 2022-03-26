const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://"+process.env.DB_USER_PASS+"@cluster0.a7s1o.mongodb.net/mern", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));


  