var express = require('express');
var router = express.Router();
const fs = require('fs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

//connection to the MongoDB test database
mongoose.connect('mongodb://localhost/calendar', {useNewUrlParser: true, useUnifiedTopology: true})

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DataBase!")
});

const EventSchema = new Schema({
    title: {type: String, required:true},
    start: {type: Date, required:true},
    end: {type: Date, required:true},
    owner: {type: String}
})
const Event = mongoose.model('Event', EventSchema)

async function loadFromDB(){
  let temp = await Event.find()
  return temp.map((elem) => {return {title:elem.title, start:elem.start, end:elem.end, owner:elem.owner, id:elem._id}})
}

async function addEvent(title, startDate, endDate, owner = null) {
  try {
    const event = new Event({
      title: title,
      start: startDate,
      end: endDate,
      owner: owner
    })
  
    await event.save()
    return "success"
  } catch (err) {
    console.error(err)
  }
}

async function findAndUpdate(id, myEvent = {}) {
  try {
    const event = await Event.findOne({_id: id})
    
    if (!event) return // if no event is found, event is empty (null)
  
    // you can modify any parameter here
    // like a normal object in javascript
    myEvent.title ? event.title = myEvent.title : null
    myEvent.start ? event.start = myEvent.start : null
    myEvent.end ? event.end = myEvent.end : null
    myEvent.owner ? event.owner = myEvent.owner : null
    // then, don’t forget to save
    await event.save()
    return "success"
  } catch (err) {
    console.log(err)
    return null
  }
  
}

router.get('/', function(req, res, next) {
  res.render('index', { calendar: calendar })
})

router.get('/events',  function(req, res) {
  let calendar = loadFromDB()
  res.json(calendar)
})

router.get('/events/ids',  function(req, res){
  let calendar = loadFromDB()
  res.json(calendar.map(x=>x._id))
})

router.get('/events/:id', function(req, res){
      let id = parseInt(req.params.id)
      let elem = findAndUpdate(id)
      if(elem){
        res.status(200).json(elem)
      } else {
        res.status(404).send('Not Found')
      }
})

router.post('/events/:id', function (req, res){
  let id = req.params.id
  res.json(findAndUpdate(id, req.body))
})
module.exports = router;
