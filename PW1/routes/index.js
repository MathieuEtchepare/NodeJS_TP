var express = require('express');
var router = express.Router();
const fs = require('fs')
let calendar = null

function saveToFile(file){
  fs.writeFile(file,JSON.stringify(calendar), (err, data) => {
    if(err) throw err
  })
}

fs.readFile('./calendar.json', 'utf8', (err, data) => {
  if (err) throw (err)
  calendar = JSON.parse(data)
})

router.get('/', function(req, res, next) {
  res.render('index', { calendar: calendar });
});

router.get('/events',  function(req, res){
  res.json(calendar)
})

router.get('/events/ids',  function(req, res){
  res.json(calendar.map(x=>x.id))
})

router.get('/events/:id', function(req, res){
      let id = parseInt(req.params.id)
      let elem = calendar.find(elem=>elem.id === id)

      if(elem){
        res.status(200).json(elem)
      } else {
        res.status(404).send('Not Found')
      }
})

router.post('events/:id', function (req, res){
  let id = req.params.id
  let test = calendar.find(elem=>elem.id == id)
  test.title = req.body.title
  saveToFile('./calendar.json')
  res.json(test)
})

module.exports = router;
