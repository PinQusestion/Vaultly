// responsible for authenticating requests using JWT tokens.

const authService = require('../services/auth.service');

async function authenticate(req, res, next){
    try{
        const token = req.cookies && req.cookies.accessToken;
        if(!token){
            return res.status(401).json({error: "Access token missing"});
        }

        const payload = authService.verifyAccessToken(token);
        if (!payload) return res.status(401).json({ error: 'Invalid or expired access token' });
        req.userId = payload.userId;
        req.userRole = payload.role;

        return next();
    }catch(err){
        return res.status(401).json({error: "Invalid or expired access token"});
    }
}

module.exports = { authenticate };