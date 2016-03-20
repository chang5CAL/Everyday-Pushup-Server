var cors= require("cors");
var express = require('express');
var router = express.Router();
router.use(cors())

/* GET home page. */
router.get('/', function(req, res, next) {

	var db = req.db;
	var collection = db.get('test')
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
	if (req.body.platform == 'ios' || req.body.platform == 'android') {
		console.log(req.body)
		res.json({message: "in theory, you're registered!"})

		/*var messgae = new gcm.Message();
		message.add("fitness-extra", "nothing!");
		var registerToken = [req.body.token];

		var sender = new gcm.Sender("1111111") // api key
		sender.send(message, { registrationTokens: registerToken,}, function(err, res) {
			if (err) console.log(err);
			else console.log(response)
		});*/
	} else {
		res.status(400);
		res.json({
			message:"invalid paramaters"
		});
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
