const router = require("express").Router();
const { LexModelBuildingService } = require("aws-sdk");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/saathiDB").catch((err) => {
  if (err) {
    console.log("====================================");
    console.log("error while connecting to mongoDB", err);
    console.log("====================================");
  } else {
    console.log("====================================");
    console.log("Successfully Connected to DB");
    console.log("====================================");
  }
});

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

var calcEndDate = (duration, type, createTime) => {
  var goalDate = new Date(createTime);
  var date = new Date();
  if (type == "weeks") {
    return date.setDate(goalDate + 7 * duration);
  } else if (type == "months") {
    return date.setDate(goalDate + 31 * duration);
  } else if (type == "years") {
    return date.setDate(goalDate + 365 * duration);
  }
};

var calcDurationAmount = (type, amount, duration) => {
  var intAmount = parseInt(amount);
  var newDuration = parseInt(duration);
  if (type == "weeks") {
    return intAmount / newDuration;
  } else if (type == "month") {
    if (newDuration == 1) {
      return intAmount / 4;
    }
    return intAmount / newDuration;
  } else if (type == "year") {
    if (newDuration == 1) {
      return intAmount / 12;
    }
    return intAmount / newDuration;
  }
};

router.post("/createGoal", (req, res) => {
  //this goal creation route
  // need to add method for goal Duration Amount
  // need to add method for goal End Date
  //need to add goal Status : default -> Active
  //need to change amount and duration from string to int
  console.log(req.body);
  var goalName = req.body.goalName;
  var goalImageUrl = req.body.goalImageUrl;
  var goalAmount = req.body.goalAmount;
  var goalDuration = req.body.goalDuration;
  var goalDurationType = req.body.goalDurationType;
  var goalDurationAmount = calcDurationAmount(
    goalDurationType,
    goalAmount,
    goalDuration
  ); // create a method
  var goalCreatedDate = req.body.goalCreatedDate;
  var goalEndDate = calcEndDate(
    goalDuration,
    goalDurationType,
    goalCreatedDate
  ); // calculate end date
  var goalCurrency = req.body.goalCurrency;
  var goalState = "Active";
  const newGoal = new Goal({
    goalName: goalName,
    goalImageUrl: goalImageUrl,
    goalAmount: goalAmount,
    goalCurrency: goalCurrency,
    goalDurationAmount: goalDurationAmount,
    goalDuration: goalDuration,
    goalDurationType: goalDurationType,
    goalCreatedDate: goalCreatedDate,
    goalEndDate: goalEndDate,
    goalState: goalState,
  })
    .save()
    .then(
      () => {
        console.log("Goal Added");
        res.sendStatus(200);
      },
      //   res.statusCode(200),
      (err) => console.log(err)
    );
});

router.post("/updatePost", (req, res) => {
  // this is to update a specific goal
});

router.post("/deleteGoal", (req, res) => {
  // this is to delete a specific goal
  var id = req.body.id;
  Goal.findByIdAndDelete(id, (err, docs) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

router.get("/allGoals", (req, res) => {
  Goal.find({}, (err, found) => {
    if (!err) {
      res.send(found).status(200);
    } else {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    }
  })
    .clone()
    .catch((err) => console.log("Some Error Occurred", err));
});

module.exports = router;
