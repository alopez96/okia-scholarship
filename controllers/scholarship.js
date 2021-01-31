//import User Schema
const Scholarship = require('../models/scholarshipModel');
const mongoose = require('mongoose');

// create post function ******************
const createPost = async (req, res) => {
    
    // get parameters from json body
    const { title, details, created_by, attachments } = req.body

    const created_on = Date.now()

    // Creates a new Post object
    let newScholarship = new Scholarship({
        title, details, created_on, created_by, attachments
    });

    newScholarship.save().then(post => res.status(201).json(post))
    .catch(err => console.log(err));
}


// Get posts function ******************
const getPosts = (req, res, next) => { 
    
    //get record from db using title
    // as of now, this is not be called from front end
    // use sort:{created_on: -1} to order by desc
    Scholarship.find({ }, null, {sort: {created_on: -1}}).then((post) => {
        if (!post) {
          return res.status(400).json({ 'Error': 'post does not exist' });
        } else {
            return res.status(200).json(post);
        }
      }).catch(next);
}

// Get posts function ******************
const getMyPosts = (req, res, next) => { 
    
  const { created_by } = req.params;
  //get record from db using created_by

  Scholarship.find({ created_by: created_by }).then((post) => {
      if (post.length == 0) {
        return res.status(200).json({ 'Error': 'You have not created any post yet' });
      } else {
          return res.status(200).json(post);
      }
    }).catch(next);
}

// Edit post function ******************
const editPost = (req, res, next) => { 
    
    //get id from request as /edit_adopt_post/<id>
    const { id } = req.params;
    //get the update as a json object from body
    const { update, created_by } = req.body;

    // transform string into Mongoose ObjectID
    post_id = mongoose.Types.ObjectId(id)

    // find a post that matches the id
    Scholarship.find({ _id: post_id }).then((post) => {
      // first verify that the user making the request is owner of the post
      if(post[0].created_by === created_by){
        // if user is owner, update the post
        // explicity must define new: true to return the objected value
        Scholarship.findByIdAndUpdate(post[0]._id, update, {new: true}).then((post) => {
        if (!post) {
          return res.status(400).json({ 'Error': 'post does not exist' });
        } else {
            return res.status(200).json(post);
        }
      }).catch(next);
      }else{
        return res.status(400).json({ 'Error': 'You do not have access to edit this post' });
      }
    })
}

// Edit post function ******************
const deletePost = (req, res, next) => { 
    
    //get id from request as /edit_adopt_post/<id>
    const { id } = req.params;

    //get the update as a json object from body
    const { created_by } = req.body;

    // transform string into Mongoose ObjectID
    post_id = mongoose.Types.ObjectId(id);

     // find a post that matches the id
     Scholarship.find({ _id: post_id }).then((post) => {
        // first verify that the user making the request is owner of the post
        if(post[0].created_by === created_by){
          // if user is owner, update the post
          // explicity must define new: true to return the objected value
          Scholarship.findByIdAndDelete(post_id).then((post) => {
            if (!post) {
              return res.status(400).json({ 'Error': 'post does not exist' });
            } else {
                return res.status(200).json({'deleted': post});
            }
          }).catch(next);
        }else{
          return res.status(400).json({ 'Error': 'You do not have access to edit this post' });
        }
      })
}

module.exports = {
    createPost: createPost,
    getPosts: getPosts,
    getMyPosts: getMyPosts,
    editPost: editPost,
    deletePost: deletePost
}