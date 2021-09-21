// import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {
          res.status(401).set('Access-Control-Allow-Origin', 'https://cometshop.netlify.app/').send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).set('Access-Control-Allow-Origin', 'https://cometshop.netlify.app/').send({ message: 'No Token' });
  }
};
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).set('Access-Control-Allow-Origin', 'https://cometshop.netlify.app/').send({ message: 'Invalid Admin Token' });
  }
};


function isEmailValid(email) {
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email)
        return false;

    if(email.length>254)
        return false;

    const valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    const parts = email.split("@");
    if(parts[0].length>64)
        return false;

    const domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}
function isPasswordValid(password) {
    const levels = {
      atLeastOneUpperCase: /[A-Z]/,
      atLeastOneDigit: /[0-9]/,
      atLeastOneSpecialChar: /[^A-Za-z0-9]/
    }
    let messages = [];

    if(password.length>20) {
        messages.push('Password must be less than 20 characters');
    }

    if(password.length<8) {
      messages.push('Password must be longer than 8 characters');
    }

    if(password === 'password') {
      messages.push('Password cannot be password');
    }

    const atLeastOneUpperCase = levels.atLeastOneUpperCase.test(password);
    if(!atLeastOneUpperCase) {
      messages.push('Password must contain at least one upper case letter');
    }
    const atLeastOneDigit = levels.atLeastOneDigit.test(password);
    if(!atLeastOneDigit) {
      messages.push('Password must contain at least one digit');
    }
    const atLeastOneSpecialChar = levels.atLeastOneSpecialChar.test(password);
    if(!atLeastOneSpecialChar) {
      messages.push('Password must contain at least one special character');
    }
    return messages;
}

module.exports = {
  isAuth,
  isAdmin,
  generateToken,
  isEmailValid,
  isPasswordValid
}