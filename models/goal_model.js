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
  if (type == "WEEKS") {
    return goalDate.setDate(goalDate + 7 * duration);
  } else if (type == "MONTHS") {
    return goalDate.setDate(goalDate + 31 * duration);
  } else if (type == "YEARS") {
    return goalDate.setDate(goalDate + 365 * duration);
  }
};

var calcDurationAmount = (type, amount, duration) => {
  var intAmount = parseInt(amount);
  var newDuration = parseInt(duration);
  if (type == "WEEKS") {
    return intAmount / newDuration;
  } else if (type == "MONTHS") {
    if (newDuration == 1) {
      return intAmount / 4;
    }
    return intAmount / newDuration;
  } else if (type == "YEARS") {
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
  var goalName = req.body.goalName;
  var goalImageUrl = req.body.goalImageUrl;
  var goalAmount = req.body.goalAmount;
  var goalDuration = req.body.goalDuration;
  var goalDurationType = req.body.goalDurationType;
  // create a method
  var goalCreatedDate = req.body.goalCreatedDate; // calculate end date
  var goalCurrency = req.body.goalCurrency;
  var goalState = "Active";
  var durationAmount = calcDurationAmount(
    goalDurationType,
    goalAmount,
    goalDuration
  );
  var endDate = calcEndDate(goalDuration, goalDurationType, goalCreatedDate);
  const newGoal = new Goal({
    goalName: goalName,
    goalImageUrl: goalImageUrl,
    goalAmount: goalAmount,
    goalCurrency: goalCurrency,
    goalDurationAmount: durationAmount,
    goalDuration: goalDuration,
    goalDurationType: goalDurationType,
    goalCreatedDate: goalCreatedDate,
    goalEndDate: endDate,
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

router.post("/updateGoal", (req, res) => {
  // this is to update a specific goal
  var status = req.body.status;
  var id = req.body.id;
  console.log("====================================");
  console.log(req.body.id);
  console.log("====================================");
  var updatedGoal = Goal.findOneAndUpdate(
    { _id: id },
    { goalState: status },
    (err, data) => {
      if (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
      } else {
        console.log("====================================");
        console.log(data);
        console.log("====================================");
      }
    }
  ).clone();
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

router.post("/findOneGoal", (req, res) => {
  var id = req.body.id;
  Goal.findById(id, (err, goal) => {
    if (!err) {
      res.send(goal);
    } else {
      console.log("====================================");
      console.log(err);
      console.log("====================================");
    }
  });
});

module.exports = router;
