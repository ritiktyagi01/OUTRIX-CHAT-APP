const jwt = require("jsonwebtoken");
secret = "harsh";
const generatetoken = (id) => {
return jwt.sign({id}, secret,{expiresIn:"30d"});
};

module.exports = generatetoken;
