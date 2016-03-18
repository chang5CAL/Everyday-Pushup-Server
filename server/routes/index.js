var express = require('express');
var router = express.Router();

var gcm = require("node-gcm");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res) {
	if (req.body.platform == 'ios' || req.body.platform == 'android') {
		console.log(req.body)
	} else {
		res.status(400);
		res.json({
			message:"invalid paramaters"
		})
	}
});

module.exports = router;
