const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  title:{
    type: String,// String is shorthand for {type: String}
    required: true
  },
  location:{
      type: String,
      required: true
  },
  postal:{
      type: String,
      required: true
  },
  description:{
      type: String,
      required: true
  },
  fetured:{
      type: String,
      default: "no"
  },
  price:{
      type: Number,
      required: true

  },
  picString:{
      type: String,
      required: true
  },

  //GOOD PRACTICE
  dateCreated:{ // mark when somthings created for the database
      type: Date,
      default: Date.now()
  },
  createdBy:{
      type: String
  }

  // for every schema you create (which is for every collection) you must also creat a model 
  //the model will allow you to perform CRUD operations on a collection
});


const listModel = mongoose.model('List', listSchema); // lets you interact with the database as a model 'task' is the colection and task schema refers to the schema it follows
module.exports = listModel; 