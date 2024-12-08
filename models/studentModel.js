const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  rollNumber: { type: String, unique: true, required: true },
});

  
const student = mongoose.model('Student', studentSchema);

module.exports = student
