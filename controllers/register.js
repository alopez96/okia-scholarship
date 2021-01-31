//import User Schema
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');             //bcrypt library is useful for salting, hashing passwords
const jwt = require('jsonwebtoken');          //jwt is used for making a token for logged in users
var passwordValidator = require('password-validator');

// add properties to validate password
// Create a schema
var schema = new passwordValidator();

schema
.is().min(6)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.is().not().oneOf(['password', 'Password']); // Blacklist these values

var schema_invalid_messg = 'Password must be at least 6 characters long, must have atleast 1 uppercase letter'+
', 1 lowercase letter, and contain at least 1 digit.';


// Register function ******************
const handleRegister = async (req, res) => {
    
  // get parameters from json body
  const {email, name, password } = req.body

  // make sure user entered email, name, and password
  if(!email || !name || !password){
      return res.status(400).json('incorrect form submission');
  }

  // regular expression for email
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // validate email
  if(!emailRegexp.test(email)){
    //invalid email format
    return res.status(400).json('invalid email format');
  }

  // validate password
  const is_valid = schema.validate(password)
  // return error if password does not meet min requirements
  if(!is_valid){
    return res.status(400).json(schema_invalid_messg);
  }

  // create username from email
  const username = email.split('@')[0];

  // first search for email in db
  // only create a new user, if email doesnt exist in DB already
  User.findOne({ email: email }).then((user) => {
    console.log('user', user)
    if (user) { 
      // If the user already exists, reject duplicate account
      return res.status(400).json({ 'Error': 'User already exists' });
    } else {
      // Creates a new User
      let newUser = new User({
        username: username,
        name: name,
        email: email,
        password: password,
        created_on: Date.now()
      });

      var numberOfSaltIterations = 12;

      // Hashes the user's chosen password to make it more secure
      try{
        bcrypt.hash(password, numberOfSaltIterations, function (err, hash) {
          if (err) throw err;
            newUser.password = hash;
          // Push the new user onto the db if successful, else display error
          newUser.save().then(user => res.status(201).json(user))
          .catch(err => console.log(err));
        })
      }
      catch(err){
        console.log(err)
        res.status(400).json({ 'Error': 'Bcrypt error' })
      }
    }
  }).catch(e => {res.status(400).json({ 'Error': 'Not able to connect to DB' }) });
  
}


// Login function ******************
const handleSignin = (req,res,next) => {
    
  // get param from json body
  const { email, password } = req.body;

  // make sure user entered email, name, and password
  if(!email || !password){
      return res.status(400).json('incorrect form submission');
  }
  
  // regular expression for email
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // validate email
  if(!emailRegexp.test(email)){
      //invalid email format
      return res.status(400).json('invalid email format');
  }

  // search for user with email. if found, compare password
  User.findOne({ email: email }).then((user) => {
      if (!user) {
        return res.status(400).json({ 'Error': 'User does not exist' });
      } else {
          bcrypt.compare(password, user.password).then(same => {
              if (same) {
                const payload = { _id: user._id, name: user.name, email: user.email };
                jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
                  res.json({
                    success: true,
                    token: 'Bearer ' + token
                  });
                });
              } else {
                return res.status(400).json({ 'Error': 'Invalid Password' });
              }
            }).catch((err) => console.log('errrrrrrrr',err));
      }
  }).catch(next);
}



// Get profile function ******************
const handleProfileGet = (req, res, next) => { 

    // get param from json body
    const { email } = req.body
    
    //get record from db using email
    // as of now, this is not be called from front end
    User.findOne({ email: email }).then((user) => {
        if (!user) {
          return res.status(400).json({ 'Error': 'User does not exist' });
        } else {
            return res.status(200).json(user);
        }
      }).catch(next);
    
}

module.exports = {
    handleProfileGet: handleProfileGet,
    handleRegister: handleRegister,
    handleSignin: handleSignin
}