const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim:true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  slug:{
    type:String,
    unqiue:true
  },
});

ProgramSchema.pre('validate',function(next){
  this.slug=slugify(this.name,{
    lower:true,
    strict:true
  })
  next();
})

const Program = mongoose.model('Program', ProgramSchema);

module.exports = Program;