var cors= require("cors");
var express = require('express');
var router = express.Router();
router.use(cors())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
	if (req.body.platform == 'ios' || req.body.platform == 'android') {
		console.log(req.body)
		var db = req.db;
		var collection = db.get("usercollection");
		collection.insert({
			"platform": req.body.platform,
			"token": req.body.token,
			"dates": [],
			"timezone": req.body.timezone
		}, function(err, doc) {
			if (err) {
				res.json({"message": "failed"});
			} else {
				res.json({"message": "success"});
			}
		})
	} else {
		res.json({"message": "failed"})
	}
});

router.get('/test', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection')
	collection.find({}, {}, function(e, docs) {
		console.log("here are the docs");
		console.log(docs);
		res.send("yay!");
	});
});

/*router.post('/update-schedule', function(req, res) {
	var user = JSON.parse(req.body.user);
	// update user with the 
	db.exercises.update(
		{ token: }
	)
});*/

module.exports = router;
