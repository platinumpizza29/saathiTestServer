const router = require("express").Router();
const { LexModelBuildingService } = require("aws-sdk");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/saathiDB");

const goalSchema = new mongoose.Schema({
  goal_id: Number,
  goalName: String,
  goalImageUrl: String,
  goalAmount: Number,
  goalCurrency: String,
  goalDurationAmount: Number,
  goalDuration: Number,
  goalDurationType: String,
  goalCreatedDate: String,
  goalState: String,
});

const Goal = mongoose.model("Goals", goalSchema);

router.post("/createGoal", (req, res) => {
  //this goal creation route
  const newGoal = new Goal({
    goal_id: 1,
    goalName: "test",
    goalImageUrl:
      "https://images.unsplash.com/photo-1671006327209-52aa2bb83072?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
    goalAmount: 1000,
    goalCurrency: "Rupees",
    goalDurationAmount: 200,
    goalDuration: 5,
    goalDurationType: "months",
    goalCreatedDate: "18/12/2022",
    goalState: "Active",
  })
    .save()
    .then(
      () => console.log("Goal Added"),
      res.statusCode(200),
      (err) => console.log(err)
    );
});

router.post("/updatePost", (req, res) => {
  // this is to update a specific goal
});

router.post("/deletePost", (req, res) => {
  // this is to delete a specific goal
});

router.get("/allgoals", (req, res) => {
  Goal.find({}, (err, found) => {
    if (!err) {
      res.send(found).status(200);
    } else {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    }
  }).catch((err) => console.log("Some Error Occurred", err));
});

module.exports = router;
