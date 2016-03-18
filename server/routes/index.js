var cors= require("cors");
var express = require('express');
var router = express.Router();
router.use(cors())

var gcm = require("node-gcm");
/* GET home page. */
router.get('/', function(req, res, next) {
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
		})
	}
});

module.exports = router;
