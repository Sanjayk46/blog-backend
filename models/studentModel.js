const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  rollNumber: { type: String, unique: true, required: true },
});
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
  });
  
const marksSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marks: { type: Number, required: true },
  });
  
const mark = mongoose.model('Marks', marksSchema);
  
const subject = mongoose.model('Subject', subjectSchema);
  
const student = mongoose.model('Student', studentSchema);

module.exports = {mark,subject,student}
