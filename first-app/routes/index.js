var express = require('express');
var router = express.Router();

//  Middleware
router.use((req, res, next) => {
  console.log('first called middleware')
  next()
})


/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(
      [{
      title: 'title',
      content: "content"
    }
  ])
})

let users = [
  {username: "hello"},
  {username: "bite"}
]

router.get('/users/login', (req, res) => {
  if(!req.session.userId) {
    req.session.userId = Math.random()
    res.json({
      message: "you are connected"
    })
  }
  else {
    res.status(401)
    res.json({
      message: "you are already connected"
    })
  }
})

router.get('/users/:name', (req, res) => {
  if(req.params.name){
    res.json(users.find(u => u.username === req.params.name))
  } else {
    res.json(users)
  }
})



module.exports = router
