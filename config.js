const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/complaintsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log("MongoDB connection error:", err));
