/*
Model for Scholarships.
first we'll create a mongoose schema,
then create a model from the schema using const model_name = mongoose.model('<model_name>', <shema>);
this will be used to register user and save to mongodb
*/

//Include libraries
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
Creation of SCholarship Schema. 
Specify a const variable with fields: title, details, created_on, created_by, attachments
*/
const mySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  attachments: [{
    type: String,
    required: false
  }]
});

// convert to model
const Scholarship = mongoose.model('Scholarship', mySchema);

//Export so that other js files can use this model
// is used by ../controllers/scholarship.js
module.exports = Scholarship;