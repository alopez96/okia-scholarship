/*
Model for Users. 
first we'll create a mongoose schema,
then create a model from the schema using const model_name = mongoose.model('<model_name>', <shema>);
this will be used to register user and save to mongodb
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
Creation of User Schema. 
Specify a const variable with fields: name, email, password, avatar, array of adopts posts, array of ride posts
*/
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    required: true
  },
  username: { // username will be the domain in the email
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
});

// convert to model
const User = mongoose.model('User', UserSchema);

//Export so that other js files can use this model
// is used by ../controllers/register.js
// is used by ../controllers/profile.js
// is used by ../controllers/signin.js
module.exports = User;