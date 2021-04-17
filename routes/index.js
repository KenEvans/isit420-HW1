var express = require('express');
var router = express.Router();

// mongoose is a API wrapper overtop of mongodb, just like
// .ADO.Net is a wrapper over raw SQL server interface
const mongoose = require("mongoose");

const Hangers = require("../hangers");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection
const dbURI =
 "mongodb+srv://bcuser:bcuser@cluster0.spomk.azure.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);



/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile('index.html');
});



/* GET all ToDos */
router.get('/ToDos', function(req, res) {
  // find {  takes values, but leaving it blank gets all}
  Hangers.find({}, (err, AllToDos) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllToDos);
  });
});



/* post a new ToDo and push to Mongo */
router.post('/NewToDo', function(req, res) {

    let oneNewToDo = new Hangers(req.body);  // call constuctor in ToDos code that makes a new mongo ToDo object
    console.log(req.body);
    oneNewToDo.save((err, todo) => {
      if (err) {
        res.status(500).send(err);
      }
      else {
      console.log(todo);
      res.status(201).json(todo);
      }
    });
});



/* delete an existing Hanger record from Mongo DB */
router.delete('/DeleteHanger/:id', function (req, res) {
  Hangers.deleteOne({ _id: req.params.id }, (err, note) => { 
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "Hanger successfully deleted" });
  });
});



/* put (update) one Hanger */
router.put('/UpdateHanger/:id', function (req, res) {
  Hangers.findOneAndUpdate(
    { _id: req.params.id },
    { hangerName: req.body.hangerName, 
      construction: req.body.construction, 
      color: req.body.color, 
      sturdiness: req.body.sturdiness,
      pantClips: req.body.pantClips
    },
   { new: true },
    (err, updHanger) => {
      if (err) {
        res.status(500).send(err);
    }
    res.status(200).json(updHanger);
    })
  });



  /* get one Hangers */
router.get('/FindHanger/:id', function(req, res) {
  console.log(req.params.id );
  Hangers.find({ _id: req.params.id }, (err, oneHanger) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(oneHanger);
  });
});

module.exports = router;
