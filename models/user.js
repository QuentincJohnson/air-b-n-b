const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const userSchema = new Schema({
  firstName:{
    type: String,// String is shorthand for {type: String}
    required: true
  },
  lastName:{
      type: String,
      required: true
  },
  email:{
      type: String,
      required: true
  },
  phoneNumber:{
      type: String,
      required: true
  },
  password:{
      type: String,
      required: true
  },
  //GOOD PRACTICE
  dateCreated:{ // mark when somthings created for the database
      type: Date,
      default: Date.now()
  },
  createdBy:{

  }

  // for every schema you create (which is for every collection) you must also creat a model 
  //the model will allow you to perform CRUD operations on a collection
});

userSchema.pre("save",function(next){// the .pre tells the program to runa function before a cirtin method in this case "save" you MUST use the next feature for it to move on to save

    //salt is randomly generator charecters or strings
    bcrypt.genSalt(10)//the higher the value the higher the number of encryption and will take longer
    .then((salt)=>{
        console.log("bruhhhhhh")
        console.log(this.password)
        bcrypt.hash(this.password,salt) // first parameter is password then next is salt
        .then((encryptpass)=>{
            this.password = encryptpass;
            next();
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    .catch((err)=>{
        console.log
    })

})

const userModel = mongoose.model('User', userSchema); // lets you interact with the database as a model 'task' is the colection and task schema refers to the schema it follows
module.exports = userModel; 