var cors= require("cors");
var express = require('express');
var router = express.Router();
router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
	console.log("register", req.body);
	if (req.body.platform == 'ios' || req.body.platform == 'android') {
		console.log(req.body)
		var db = req.db;
		var collection = db.get("usercollection3");
		collection.insert({
			"platform": req.body.platform,
			"token": req.body.token,
			"dates": JSON.stringify([]),
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
	var collection = db.get('usercollection2');
	collection.find({}, {}, function(e, docs) {
		console.log("here are the docs");
		console.log(docs);
		res.send("yay!");
	});
});

router.post('/update-schedule', function(req, res) {
	console.log("update schedule " + req.body.token);
	console.log("update schedule " + req.body.dates);
	var db = req.db;
	var collection = db.get('usercollection3');
	// update user with the 
	collection.update(
		{ "token": req.body.token},
		{$set:{"dates": req.body.dates}}
	, function(err) {
		console.log(err);
		res.send("yay");
	});
});


router.get('/udt', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection2');
	console.log("Doing update");
	collection.update(
		{"email":"emailtest1"},
		{$set:{"username":"testgooddog"}}
	)
});

module.exports = router;
