const router = require('express').Router();
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: '..' });

function authenticateToken(req, res, next) {
    const authHeader = req.body.authToken
    console.log(authHeader);
    const token = authHeader
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user_id) => {
        console.log(err);
        if (err) return res.status(403).json()
        console.log(user_id);
        req.body.user_id = user_id.userId
        req.body.userType = user_id.userType
        next()
    })
}

router.route('/verifyUser').post(authenticateToken, (req, res) => {
    console.log(req.body.user_id, req.body.userType);
    res.json({ id: req.body.user_id , userType: req.body.userType });
});


module.exports = router;
