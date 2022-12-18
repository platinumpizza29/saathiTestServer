const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const goalRoute = require("./models/goal_model");

//middlewares
app.use(bodyParser());
app.use("/goal", goalRoute);

//routes
//default route
app.get("/", (req, res) => {
  res.send("we are at home");
});

//port listening to
app.listen(4000);
